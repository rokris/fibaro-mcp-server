"""Tests for Fibaro MCP Server."""

import pytest
from fibaro_mcp.fibaro_client import FibaroClient


@pytest.mark.asyncio
async def test_fibaro_client_initialization():
    """Test that FibaroClient can be initialized."""
    client = FibaroClient(
        host="192.168.1.100",
        username="admin",
        password="password",
    )
    assert client.host == "192.168.1.100"
    assert client.username == "admin"
    assert client.base_url == "http://192.168.1.100/api"
    await client.close()


@pytest.mark.asyncio
async def test_fibaro_client_https():
    """Test that FibaroClient uses HTTPS when configured."""
    client = FibaroClient(
        host="192.168.1.100",
        username="admin",
        password="password",
        use_https=True,
    )
    assert client.base_url == "https://192.168.1.100/api"
    await client.close()
