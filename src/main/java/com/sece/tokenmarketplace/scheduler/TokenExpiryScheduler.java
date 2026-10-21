package com.sece.tokenmarketplace.scheduler;

import com.sece.tokenmarketplace.dao.DigitalTokenDao;
import com.sece.tokenmarketplace.dao.TokenTransferDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TokenExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TokenExpiryScheduler.class);

    private final DigitalTokenDao tokenDao;
    private final TokenTransferDao transferDao;

    public TokenExpiryScheduler(DigitalTokenDao tokenDao, TokenTransferDao transferDao) {
        this.tokenDao = tokenDao;
        this.transferDao = transferDao;
    }

    /**
     * Runs automatically every minute to identify expired tokens and mark them accordingly.
     * Also auto-rejects any open pending transfer requests for expired tokens.
     */
    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void sweepExpiredTokens() {
        int newlyExpired = tokenDao.markExpiredTokens();
        int autoRejectedRequests = transferDao.rejectPendingRequestsForExpiredTokens();

        if (newlyExpired > 0 || autoRejectedRequests > 0) {
            logger.info("[TokenExpiryScheduler] Swept database: {} tokens marked EXPIRED, {} pending requests auto-rejected.",
                    newlyExpired, autoRejectedRequests);
        }
    }
}
