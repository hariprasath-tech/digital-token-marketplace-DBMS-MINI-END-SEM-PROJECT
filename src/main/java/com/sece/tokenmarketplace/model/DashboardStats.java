package com.sece.tokenmarketplace.model;

import java.util.List;
import java.util.Map;

public class DashboardStats {
    private long totalTokens;
    private long availableTokens;
    private long pendingTransfers;
    private long completedTransfers;
    private long usedTokens;
    private long expiredTokens;
    private long totalStudents;
    private long totalActivities;
    private Map<String, Long> tokensByCategory;
    private Map<String, Long> tokensByStatus;
    private List<TokenTransferHistory> recentTransfers;

    public DashboardStats() {
    }

    public long getTotalTokens() {
        return totalTokens;
    }

    public void setTotalTokens(long totalTokens) {
        this.totalTokens = totalTokens;
    }

    public long getAvailableTokens() {
        return availableTokens;
    }

    public void setAvailableTokens(long availableTokens) {
        this.availableTokens = availableTokens;
    }

    public long getPendingTransfers() {
        return pendingTransfers;
    }

    public void setPendingTransfers(long pendingTransfers) {
        this.pendingTransfers = pendingTransfers;
    }

    public long getCompletedTransfers() {
        return completedTransfers;
    }

    public void setCompletedTransfers(long completedTransfers) {
        this.completedTransfers = completedTransfers;
    }

    public long getUsedTokens() {
        return usedTokens;
    }

    public void setUsedTokens(long usedTokens) {
        this.usedTokens = usedTokens;
    }

    public long getExpiredTokens() {
        return expiredTokens;
    }

    public void setExpiredTokens(long expiredTokens) {
        this.expiredTokens = expiredTokens;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Map<String, Long> getTokensByCategory() {
        return tokensByCategory;
    }

    public void setTokensByCategory(Map<String, Long> tokensByCategory) {
        this.tokensByCategory = tokensByCategory;
    }

    public Map<String, Long> getTokensByStatus() {
        return tokensByStatus;
    }

    public void setTokensByStatus(Map<String, Long> tokensByStatus) {
        this.tokensByStatus = tokensByStatus;
    }

    public List<TokenTransferHistory> getRecentTransfers() {
        return recentTransfers;
    }

    public void setRecentTransfers(List<TokenTransferHistory> recentTransfers) {
        this.recentTransfers = recentTransfers;
    }
}
