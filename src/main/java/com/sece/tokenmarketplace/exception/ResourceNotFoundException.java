package com.sece.tokenmarketplace.exception;

public class ResourceNotFoundException extends MarketplaceException {
    public ResourceNotFoundException(String message) {
        super(message, 404);
    }
}
