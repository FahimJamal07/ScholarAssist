import os
import logging
import asyncio
from typing import Optional, Dict, Any, List
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from backend.config.settings import settings

logger = logging.getLogger("scholar_assist.adapters.gemini")

class GeminiAdapter:
    """
    Adapter for Google's Gemini API utilizing async SDK bindings, exponential backoff retries,
    token-optimized generation configurations, and comprehensive safety bypasses.
    """
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set in environment variables.")
        
        genai.configure(api_key=self.api_key)
        
        # Enforce gemini-1.5-flash as the primary fast reasoning engine
        self.default_model_name = "gemini-1.5-flash"
        # Optional: Use Pro for highly complex, unconstrained logical breakdown
        self.reasoning_model_name = "gemini-1.5-pro"
        
        # Token optimization defaults minimizing generation cost/latency
        self.default_config = genai.types.GenerationConfig(
            temperature=0.3,
            top_p=0.8,
            top_k=40,
            max_output_tokens=2048,
        )
        
        # Override strict safety defaults to allow parsing medical/biological academic papers
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

    async def _generate_with_retry(
        self, 
        model_name: str, 
        prompt: str, 
        system_instruction: str = None,
        config: Optional[genai.types.GenerationConfig] = None,
        retries: int = 3, 
        timeout: int = 30
    ) -> str:
        """Core asynchronous execution method mapping network resilience patterns."""
        model_kwargs = {"model_name": model_name}
        if system_instruction:
            model_kwargs["system_instruction"] = system_instruction
            
        model = genai.GenerativeModel(**model_kwargs)
        generation_config = config if config else self.default_config
        
        for attempt in range(1, retries + 1):
            try:
                # Enforce timeout boundary on asynchronous API calls
                response = await asyncio.wait_for(
                    model.generate_content_async(
                        prompt,
                        generation_config=generation_config,
                        safety_settings=self.safety_settings
                    ),
                    timeout=timeout
                )
                
                # Graceful extraction check preventing SDK exceptions on blocked queries
                if not response.parts:
                    logger.warning("Empty response or blocked by safety filter.")
                    if response.prompt_feedback:
                        logger.warning(f"Feedback: {response.prompt_feedback}")
                    return "Error: Empty response or generation blocked by safety filters."
                
                return response.text
                
            except asyncio.TimeoutError:
                logger.warning(f"Gemini API timeout on attempt {attempt}/{retries}")
                if attempt == retries:
                    logger.error("Max retries exceeded for Gemini API due to timeouts.")
                    raise Exception(f"Gemini API request timed out after {retries} attempts.")
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                logger.warning(f"Gemini API error on attempt {attempt}/{retries}: {str(e)}")
                if attempt == retries:
                    logger.error(f"Gemini API fatal failure: {str(e)}")
                    raise Exception(f"Gemini API request failed: {str(e)}")
                await asyncio.sleep(2 ** attempt)

    async def summarize_text(self, text: str, max_tokens: int = 500) -> str:
        """Capability: Summarization. Aggregates text into dense summaries."""
        system_instruction = "You are an expert academic summarizer. Provide concise, objective summaries of the provided research text."
        prompt = f"Summarize the following text in under {max_tokens} words:\n\n{text}"
        
        logger.info("Executing Gemini summarization capability.")
        return await self._generate_with_retry(
            model_name=self.default_model_name,
            prompt=prompt,
            system_instruction=system_instruction
        )

    async def question_answering(self, context: str, question: str) -> str:
        """Capability: Question Answering (RAG). Anchors answers strictly to context."""
        system_instruction = (
            "You are a strict academic QA assistant. Answer questions based ONLY on the provided context. "
            "If the answer is not in the context, explicitly state 'I cannot answer this based on the provided text.' "
            "Do not hallucinate external knowledge."
        )
        prompt = f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
        
        logger.info("Executing Gemini RAG question-answering capability.")
        return await self._generate_with_retry(
            model_name=self.default_model_name,
            prompt=prompt,
            system_instruction=system_instruction
        )

    async def generate_explanation(self, text: str, target_audience: str = "undergraduate student") -> str:
        """Capability: Explanation Generation. Simplifies concepts for specified audiences."""
        system_instruction = f"You are an academic tutor. Explain complex concepts clearly, accurately, and intuitively for an audience of: {target_audience}."
        prompt = f"Explain the following concept or text:\n\n{text}"
        
        logger.info(f"Executing Gemini explanation capability for audience: {target_audience}.")
        # Routing to the 'pro' reasoning model for deeper conceptual breakdown
        return await self._generate_with_retry(
            model_name=self.reasoning_model_name,
            prompt=prompt,
            system_instruction=system_instruction
        )
        
    async def generate_structured_json(self, prompt: str, schema_dict: dict) -> str:
        """Capability: Structured Outputs. Forces JSON schema constraint on generation."""
        logger.info("Executing Gemini structured JSON generation.")
        config = genai.types.GenerationConfig(
            temperature=0.1, # Extremely low temperature for strict schema mapping
            response_mime_type="application/json",
        )
        # Fallback enforcement logic mapping against prompt structural injection
        enforced_prompt = f"{prompt}\n\nIMPORTANT: You must output valid JSON exactly matching this schema structure:\n{schema_dict}"
        
        return await self._generate_with_retry(
            model_name=self.default_model_name,
            prompt=enforced_prompt,
            config=config
        )

# Instantiate a singleton adapter to be injected globally
gemini_adapter = GeminiAdapter()
