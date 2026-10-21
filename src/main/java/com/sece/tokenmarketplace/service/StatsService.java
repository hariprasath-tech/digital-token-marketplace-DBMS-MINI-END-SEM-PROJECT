package com.sece.tokenmarketplace.service;

import com.sece.tokenmarketplace.dao.*;
import com.sece.tokenmarketplace.model.DashboardStats;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final DigitalTokenDao tokenDao;
    private final CampusActivityDao activityDao;
    private final StudentDao studentDao;
    private final TokenTransferDao transferDao;
    private final HistoryDao historyDao;

    public StatsService(DigitalTokenDao tokenDao, CampusActivityDao activityDao,
                        StudentDao studentDao, TokenTransferDao transferDao,
                        HistoryDao historyDao) {
        this.tokenDao = tokenDao;
        this.activityDao = activityDao;
        this.studentDao = studentDao;
        this.transferDao = transferDao;
        this.historyDao = historyDao;
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalTokens(tokenDao.count());
        stats.setAvailableTokens(tokenDao.countByStatus("AVAILABLE"));
        stats.setPendingTransfers(transferDao.countPending());
        stats.setCompletedTransfers(historyDao.count());
        stats.setUsedTokens(tokenDao.countByStatus("USED"));
        stats.setExpiredTokens(tokenDao.countByStatus("EXPIRED"));
        stats.setTotalStudents(studentDao.findAll().size());
        stats.setTotalActivities(activityDao.count());

        stats.setTokensByStatus(tokenDao.countGroupByStatus());
        stats.setTokensByCategory(tokenDao.countGroupByCategory());
        stats.setRecentTransfers(historyDao.findAll(null, null, 5));

        return stats;
    }

    public int runManualExpiryCheck() {
        int expiredTokens = tokenDao.markExpiredTokens();
        int rejectedRequests = transferDao.rejectPendingRequestsForExpiredTokens();
        return expiredTokens;
    }
}
