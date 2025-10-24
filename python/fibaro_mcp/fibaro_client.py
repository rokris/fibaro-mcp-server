"""Fibaro Home Center 2 API Client."""

import httpx
from typing import Any, Optional
import logging

logger = logging.getLogger(__name__)


class FibaroClient:
    """Client for communicating with Fibaro Home Center 2 API."""

    def __init__(
        self,
        host: str,
        username: str,
        password: str,
        use_https: bool = False,
        timeout: float = 30.0,
    ):
        """
        Initialize Fibaro client.

        Args:
            host: Fibaro HC2 hostname or IP address
            username: Username for authentication
            password: Password for authentication
            use_https: Whether to use HTTPS (default: False)
            timeout: Request timeout in seconds (default: 30.0)
        """
        self.host = host
        self.username = username
        self.password = password
        self.timeout = timeout
        protocol = "https" if use_https else "http"
        self.base_url = f"{protocol}://{host}/api"

        # Create HTTP client with basic auth
        self.client = httpx.AsyncClient(
            auth=(username, password),
            timeout=timeout,
            verify=False,  # Disable SSL verification for local network
        )

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

    async def _get(self, endpoint: str) -> Any:
        """
        Make GET request to API.

        Args:
            endpoint: API endpoint (without /api prefix)

        Returns:
            JSON response data
        """
        url = f"{self.base_url}/{endpoint}"
        logger.debug(f"GET {url}")

        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error: {e}")
            raise

    async def _post(self, endpoint: str, data: Optional[dict] = None) -> Any:
        """
        Make POST request to API.

        Args:
            endpoint: API endpoint (without /api prefix)
            data: Request body data

        Returns:
            JSON response data
        """
        url = f"{self.base_url}/{endpoint}"
        logger.debug(f"POST {url} with data: {data}")

        try:
            response = await self.client.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error: {e}")
            raise

    async def _put(self, endpoint: str, data: Optional[dict] = None) -> Any:
        """
        Make PUT request to API.

        Args:
            endpoint: API endpoint (without /api prefix)
            data: Request body data

        Returns:
            JSON response data
        """
        url = f"{self.base_url}/{endpoint}"
        logger.debug(f"PUT {url} with data: {data}")

        try:
            response = await self.client.put(url, json=data)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"HTTP error: {e}")
            raise

    # Device endpoints
    async def get_devices(self) -> list[dict]:
        """Get all devices."""
        return await self._get("devices")

    async def get_device(self, device_id: int) -> dict:
        """Get specific device by ID."""
        return await self._get(f"devices/{device_id}")

    async def call_action(
        self, device_id: int, action: str, args: Optional[list] = None
    ) -> dict:
        """
        Call an action on a device.

        Args:
            device_id: Device ID
            action: Action name (e.g., 'turnOn', 'turnOff', 'setValue')
            args: Optional list of arguments for the action

        Returns:
            Response data
        """
        endpoint = f"devices/{device_id}/action/{action}"
        data = {"args": args or []}
        return await self._post(endpoint, data)

    # Room endpoints
    async def get_rooms(self) -> list[dict]:
        """Get all rooms."""
        return await self._get("rooms")

    async def get_room(self, room_id: int) -> dict:
        """Get specific room by ID."""
        return await self._get(f"rooms/{room_id}")

    # Scene endpoints
    async def get_scenes(self) -> list[dict]:
        """Get all scenes."""
        return await self._get("scenes")

    async def get_scene(self, scene_id: int) -> dict:
        """Get specific scene by ID."""
        return await self._get(f"scenes/{scene_id}")

    async def trigger_scene(self, scene_id: int) -> dict:
        """Trigger/execute a scene."""
        return await self._post(f"scenes/{scene_id}/action/start")

    # System endpoints
    async def get_system_info(self) -> dict:
        """Get system information."""
        return await self._get("settings/info")

    async def get_weather(self) -> dict:
        """Get weather information."""
        return await self._get("panels/weather")

    # Variables endpoints
    async def get_global_variables(self) -> list[dict]:
        """Get all global variables."""
        return await self._get("globalVariables")

    async def get_global_variable(self, var_name: str) -> dict:
        """Get specific global variable by name."""
        return await self._get(f"globalVariables/{var_name}")

    async def set_global_variable(self, var_name: str, value: Any) -> dict:
        """Set a global variable value."""
        data = {"value": str(value)}
        return await self._put(f"globalVariables/{var_name}", data)
