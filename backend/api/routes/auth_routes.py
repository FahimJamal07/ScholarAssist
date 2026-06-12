import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.config.database import get_db
from backend.models.database_models import User
from backend.models.request_models import UserRegisterRequest, UserLoginRequest
from backend.models.response_models import APIResponse, TokenResponse, UserResponse
from backend.utils.security import get_password_hash, verify_password, create_access_token
from backend.api.middleware.auth_middleware import verify_token

logger = logging.getLogger("scholar_assist.api.auth")
router = APIRouter()

@router.post("/auth/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    request_data: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    Validates that the email and username are unique.
    """
    try:
        # Check if email exists
        result = await db.execute(select(User).where(User.email == request_data.email))
        if result.scalars().first():
            raise ValueError("Email already registered.")

        # Check if username exists
        result = await db.execute(select(User).where(User.username == request_data.username))
        if result.scalars().first():
            raise ValueError("Username already taken.")

        # Create new user
        hashed_password = get_password_hash(request_data.password)
        new_user = User(
            username=request_data.username,
            email=request_data.email,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        # Generate token
        token_payload = {"sub": str(new_user.id), "email": new_user.email}
        token = create_access_token(data=token_payload)

        user_data = UserResponse(id=str(new_user.id), username=new_user.username, email=new_user.email)
        token_res = TokenResponse(token=token, user=user_data)

        return APIResponse(
            success=True,
            message="User registered successfully.",
            data=token_res.dict()
        )

    except ValueError as ve:
        logger.warning(f"Registration validation error: {str(ve)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.exception(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/auth/login", response_model=APIResponse)
async def login_user(
    request_data: UserLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return a JWT token.
    """
    try:
        # Fetch user
        result = await db.execute(select(User).where(User.email == request_data.email))
        user = result.scalars().first()

        if not user or not verify_password(request_data.password, user.hashed_password):
            logger.warning(f"Failed login attempt for email: {request_data.email}")
            raise ValueError("Invalid email or password.")

        if not user.is_active:
            raise ValueError("Account is deactivated.")

        # Generate token
        token_payload = {"sub": str(user.id), "email": user.email}
        token = create_access_token(data=token_payload)

        user_data = UserResponse(id=str(user.id), username=user.username, email=user.email)
        token_res = TokenResponse(token=token, user=user_data)

        return APIResponse(
            success=True,
            message="Login successful.",
            data=token_res.dict()
        )

    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(ve))
    except Exception as e:
        logger.exception(f"Unexpected error during login: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/auth/me", response_model=APIResponse)
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get the currently authenticated user's profile based on the JWT token.
    """
    try:
        payload = await verify_token(request)
        user_id = payload.get("sub")
        
        if not user_id:
            raise ValueError("Invalid token payload.")
            
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        
        if not user:
            raise ValueError("User not found.")
            
        user_data = UserResponse(id=str(user.id), username=user.username, email=user.email)
        
        return APIResponse(
            success=True,
            message="User fetched successfully.",
            data=user_data.dict()
        )
    except Exception as e:
        logger.warning(f"Auth token verification failed in /me: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session. Please login again.")
