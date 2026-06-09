import logging
from database.connection import db_connection_manager

logger = logging.getLogger("scholar_assist.database")

def seed_database():
    logger.info("Starting database seeding procedures...")
    
    conn = None
    try:
        conn = db_connection_manager.get_raw_connection()
        cur = conn.cursor()
        
        # 1. Seed test user
        cur.execute(
            "INSERT INTO users (username, email, hashed_password) "
            "VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;",
            ("test_researcher", "researcher@scholarassist.ai", "pbkdf2:sha256:mock_hash")
        )
        
        # 2. Seed test paper
        cur.execute(
            "INSERT INTO papers (id, title, authors, file_path, file_size) "
            "VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;",
            ("attention_is_all_you_need", "Attention Is All You Need", "Vaswani et al.", "/storage/attention.pdf", 2048576)
        )
        
        conn.commit()
        logger.info("Successfully seeded database objects.")
    except Exception as e:
        logger.error(f"Error during seeding procedure: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    seed_database()
