import logging
import asyncio
from typing import Optional, Dict, Any, List
from anthropic import AsyncAnthropic, APIError, APITimeoutError, RateLimitError
from backend.config.settings import settings

logger = logging.getLogger("scholar_assist.adapters.claude")

class ClaudeAdapter:
    """
    Adapter for Anthropic's Claude API utilizing the Async SDK, exponential backoff retries,
    and optimized prompts for long-form, source-grounded academic synthesis.
    """
    def __init__(self):
        self.api_key = settings.CLAUDE_API_KEY
        if not self.api_key:
            logger.warning("CLAUDE_API_KEY is not set in environment variables.")
            
        self.client = AsyncAnthropic(api_key=self.api_key)
        
        # Enforce claude-3.5-sonnet for rapid high-quality synthesis and opus for massive integration tasks
        self.default_model = "claude-3-5-sonnet-20240620"
        self.heavy_model = "claude-3-opus-20240229"
        
        # Claude excels at extremely long outputs; setting default high
        self.default_max_tokens = 4096

    async def _generate_with_retry(
        self,
        prompt: str,
        system_instruction: str,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: float = 0.2,
        retries: int = 3,
        timeout: int = 60
    ) -> str:
        """Asynchronous execution with exponential backoff for Claude API resilience."""
        target_model = model or self.default_model
        tokens = max_tokens or self.default_max_tokens
        
        for attempt in range(1, retries + 1):
            try:
                # The Anthropic SDK has its own timeout management, but we wrap it for absolute safety
                response = await asyncio.wait_for(
                    self.client.messages.create(
                        model=target_model,
                        max_tokens=tokens,
                        temperature=temperature,
                        system=system_instruction,
                        messages=[
                            {"role": "user", "content": prompt}
                        ]
                    ),
                    timeout=timeout
                )
                
                return response.content[0].text
                
            except APITimeoutError:
                logger.warning(f"Claude API native timeout on attempt {attempt}/{retries}")
                if attempt == retries:
                    raise Exception(f"Claude API request natively timed out after {retries} attempts.")
                await asyncio.sleep(2 ** attempt)
            
            except RateLimitError:
                logger.warning(f"Claude API rate limit hit on attempt {attempt}/{retries}")
                if attempt == retries:
                    raise Exception("Claude API rate limit exceeded. Please check tier constraints.")
                await asyncio.sleep((2 ** attempt) + 2) # Extra delay specifically for rate limits
                
            except asyncio.TimeoutError:
                logger.warning(f"Asyncio boundary timeout on Claude API attempt {attempt}/{retries}")
                if attempt == retries:
                    raise Exception(f"Claude API asyncio execution timeout after {retries} attempts.")
                await asyncio.sleep(2 ** attempt)
                
            except APIError as e:
                logger.error(f"Claude API error on attempt {attempt}/{retries}: {str(e)}")
                if attempt == retries:
                    raise Exception(f"Claude API request failed: {str(e)}")
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                logger.error(f"Unexpected Claude API error: {str(e)}")
                raise

    async def generate_literature_review(self, theme: str, papers_context: str) -> str:
        """Capability: Literature review generation. Synthesizes multiple papers into a coherent review."""
        system_instruction = (
            "You are an expert academic researcher. Generate a comprehensive, well-structured "
            "literature review based ONLY on the provided papers. Ensure all claims are strictly "
            "source-grounded using in-text citations corresponding to the provided sources. "
            "Do not introduce outside knowledge or hallucinate findings."
        )
        
        prompt = f"Theme for Literature Review: {theme}\n\nSource Papers Context:\n{papers_context}\n\nPlease generate the literature review."
        
        logger.info(f"Executing Claude literature review generation for theme: {theme[:50]}...")
        return await self._generate_with_retry(
            prompt=prompt,
            system_instruction=system_instruction,
            model=self.heavy_model, # Use Opus for deep thematic synthesis
            timeout=120 # Synthesis inherently takes longer
        )

    async def run_comparative_analysis(self, aspects: List[str], papers_context: str) -> str:
        """Capability: Comparative analysis. Analyzes distinct aspects across multiple research papers."""
        aspects_str = ", ".join(aspects) if aspects else "general findings and methodologies"
        
        system_instruction = (
            "You are an expert academic analyst. Perform a detailed comparative analysis of the provided "
            "papers. Focus heavily on contrasting methodologies, results, and limitations based on the requested aspects. "
            "Base your entire analysis strictly on the provided context."
        )
        
        prompt = f"Aspects to Compare: {aspects_str}\n\nSource Papers Context:\n{papers_context}\n\nPlease perform the comparative analysis."
        
        logger.info(f"Executing Claude comparative analysis on aspects: {aspects_str}...")
        return await self._generate_with_retry(
            prompt=prompt,
            system_instruction=system_instruction,
            timeout=90
        )

    async def generate_scientific_synthesis(self, context: str, focus_area: str) -> str:
        """Capability: Long-form scientific synthesis. Deep integration of concepts and data."""
        system_instruction = (
            "You are a distinguished scientific author. Synthesize the provided academic texts into a "
            "long-form, heavily detailed scientific synthesis focusing on the requested area. "
            "Maintain a formal, objective, and rigorous academic tone. "
            "Every significant assertion must be rigorously traceable to the provided context."
        )
        
        prompt = f"Focus Area: {focus_area}\n\nContext Data:\n{context}\n\nPlease generate the extensive scientific synthesis."
        
        logger.info(f"Executing Claude long-form scientific synthesis on focus area: {focus_area[:50]}...")
        return await self._generate_with_retry(
            prompt=prompt,
            system_instruction=system_instruction,
            model=self.heavy_model,
            max_tokens=4096,
            timeout=120
        )

    async def generate_structured_json(self, prompt: str, schema_dict: dict, context: str) -> str:
        """Capability: Structured Outputs. Forces JSON schema constraint on generation using Claude."""
        logger.info("Executing Claude structured JSON extraction.")
        system_instruction = (
            "You are a strict data extraction system. You must output ONLY valid JSON matching the exact schema provided. "
            "Do not include any markdown formatting, preamble, conversational text, or explanation. Output strictly parseable JSON."
        )
        
        enforced_prompt = (
            f"Context:\n{context}\n\n"
            f"Extraction Request: {prompt}\n\n"
            f"REQUIRED JSON SCHEMA FORMAT:\n{schema_dict}\n\n"
            "Output the raw JSON now:"
        )
        
        # Using a very low temperature for strict schema adherence without hallucinations
        response_text = await self._generate_with_retry(
            prompt=enforced_prompt,
            system_instruction=system_instruction,
            temperature=0.0
        )
        
        # Clean potential markdown wrapping automatically generated by LLMs just in case
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json\n", "", 1)
        if response_text.endswith("```"):
            response_text = response_text.rsplit("```", 1)[0]
            
        return response_text.strip()

claude_adapter = ClaudeAdapter()
