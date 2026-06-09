# Model configurations and metadata for orchestration routing

MODEL_METADATA = {
    "gemini-1.5-flash": {
        "provider": "google",
        "context_window": 1048576,
        "max_output_tokens": 8192,
        "cost_per_million_input": 0.35,
        "cost_per_million_output": 1.05
    },
    "claude-3-opus-20240229": {
        "provider": "anthropic",
        "context_window": 200000,
        "max_output_tokens": 4096,
        "cost_per_million_input": 15.00,
        "cost_per_million_output": 75.00
    }
}
