package com.sece.tokenmarketplace.dao;

import com.sece.tokenmarketplace.model.TokenTransferHistory;

import java.util.List;

public interface HistoryDao {
    List<TokenTransferHistory> findAll(String search, Integer studentId, Integer limit);
    TokenTransferHistory save(TokenTransferHistory history);
    long count();
}
