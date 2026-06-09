import logging

logger = logging.getLogger("scholar_assist")

class ResponseAggregator:
    def aggregate(self, responses: dict) -> str:
        logger.info("Aggregating multi-model response payloads")
        
        aggregated_result = []
        for model_name, response_text in responses.items():
            aggregated_result.append(
                f"--- Response from {model_name.upper()} ---\n"
                f"{response_text}\n"
            )
            
        return "\n".join(aggregated_result)

response_aggregator = ResponseAggregator()
