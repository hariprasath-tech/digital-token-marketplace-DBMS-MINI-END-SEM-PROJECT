package com.sece.tokenmarketplace.exception;

public class MarketplaceException extends RuntimeException {
    private final int statusCode;

    public MarketplaceException(String message) {
        super(message);
        this.statusCode = 400;
    }

    public MarketplaceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public MarketplaceException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
