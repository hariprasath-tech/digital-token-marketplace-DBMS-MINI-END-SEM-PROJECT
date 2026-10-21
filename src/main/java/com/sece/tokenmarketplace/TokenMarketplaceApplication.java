package com.sece.tokenmarketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TokenMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TokenMarketplaceApplication.class, args);
    }
}
