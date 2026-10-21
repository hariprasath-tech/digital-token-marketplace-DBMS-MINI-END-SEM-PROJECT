package com.sece.tokenmarketplace.console;

import com.sece.tokenmarketplace.exception.MarketplaceException;
import com.sece.tokenmarketplace.model.*;
import com.sece.tokenmarketplace.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

@Component
public class ConsoleMenuRunner implements CommandLineRunner {

    private final StudentService studentService;
    private final ActivityService activityService;
    private final TokenService tokenService;
    private final TransferService transferService;
    private final StatsService statsService;

    private Student currentStudent = null;
    private final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public ConsoleMenuRunner(StudentService studentService,
                             ActivityService activityService,
                             TokenService tokenService,
                             TransferService transferService,
                             StatsService statsService) {
        this.studentService = studentService;
        this.activityService = activityService;
        this.tokenService = tokenService;
        this.transferService = transferService;
        this.statsService = statsService;
    }

    @Override
    public void run(String... args) throws Exception {
        boolean consoleRequested = Arrays.asList(args).contains("--console")
                || System.getProperty("console") != null;

        if (!consoleRequested) {
            System.out.println(">>> Digital Token Marketplace Web Server running at http://localhost:8080");
            System.out.println(">>> (To launch menu-driven console mode, use: mvn spring-boot:run -Dspring-boot.run.arguments=--console)");
            return;
        }

        // Start console in separate thread so server stays alive and user can interact
        Thread consoleThread = new Thread(this::startConsoleInterface, "ConsoleMenuThread");
        consoleThread.start();
    }

    private void startConsoleInterface() {
        Scanner scanner = new Scanner(System.in);

        // Default login with Hari Prasath (student_id = 1) if available
        try {
            currentStudent = studentService.getById(1);
        } catch (Exception e) {
            List<Student> students = studentService.getAll();
            if (!students.isEmpty()) {
                currentStudent = students.get(0);
            }
        }

        printBanner();

        boolean running = true;
        while (running) {
            try {
                printMainMenu();
                System.out.print("Enter your choice (0-11): ");
                String input = scanner.nextLine().trim();

                switch (input) {
                    case "1":
                        handleStudentSwitcher(scanner);
                        break;
                    case "2":
                        handleStudentRegistration(scanner);
                        break;
                    case "3":
                        handleBrowseActivities(scanner);
                        break;
                    case "4":
                        handleAddActivity(scanner);
                        break;
                    case "5":
                        handleBrowseTokens(scanner);
                        break;
                    case "6":
                        handleCreateToken(scanner);
                        break;
                    case "7":
                        handleRequestTransfer(scanner);
                        break;
                    case "8":
                        handleManageIncomingRequests(scanner);
                        break;
                    case "9":
                        handleManageOutgoingRequests(scanner);
                        break;
                    case "10":
                        handleMarkTokenAsUsed(scanner);
                        break;
                    case "11":
                        handleViewHistoryAndStats(scanner);
                        break;
                    case "0":
                        System.out.println("\nExiting console mode. Spring Boot server continues running.");
                        running = false;
                        break;
                    default:
                        System.out.println("[!] Invalid choice. Please enter a number between 0 and 11.\n");
                }
            } catch (Exception e) {
                System.out.println("\n[ERROR] " + e.getMessage() + "\n");
            }
        }
    }

    private void printBanner() {
        System.out.println("\n" +
                "========================================================================================\n" +
                "    ____  _________________    __     ______ ____  __ __ ______ _   __               \n" +
                "   / __ \\/  _/ ____/  _/_  __/   | |   / / __ \\/ //_// ____/ | / /               \n" +
                "  / / / // // / __  / /  / / / /|_| |  / / /_/ / ,<  / __/ /  |/ /                \n" +
                " / /_/ // // /_/ /_/ /  / / / ___ | | / / ____/ /| |/ /___/ /|  /                 \n" +
                "/_____/___/\\____/___/  /_/ /_/  |_| |/_/_/   /_/ |_/_____/_/ |_/                  \n" +
                "                  M A R K E T P L A C E  (SECE CAMPUS)                                  \n" +
                "========================================================================================\n" +
                " DBMS Mini Project | Author: Hari Prasath | Sri Eshwar College of Engineering\n" +
                " Plain JDBC Architecture | MySQL 8 | Row Locking & Concurrency Control\n" +
                " Web UI: http://localhost:8080\n" +
                "========================================================================================\n");
    }

    private void printMainMenu() {
        System.out.println("----------------------------------------------------------------------------------------");
        if (currentStudent != null) {
            System.out.println("ACTIVE STUDENT: " + currentStudent.getName() + " (" + currentStudent.getRollNo() +
                    ") | Dept: " + currentStudent.getDepartment() + " | Email: " + currentStudent.getEmail());
        } else {
            System.out.println("ACTIVE STUDENT: [None Selected - Please login or switch]");
        }
        System.out.println("----------------------------------------------------------------------------------------");
        System.out.println(" 1. Switch / View Active Student");
        System.out.println(" 2. Register New Student");
        System.out.println(" 3. View Campus Activities");
        System.out.println(" 4. Add New Campus Activity");
        System.out.println(" 5. Browse Marketplace Tokens (Search & Filter)");
        System.out.println(" 6. List a New Digital Token");
        System.out.println(" 7. Request a Token Transfer");
        System.out.println(" 8. My Listed Tokens & Incoming Requests (Approve / Reject with Row Lock)");
        System.out.println(" 9. My Outgoing Requests (Cancel)");
        System.out.println("10. Redeem / Mark My Token as USED");
        System.out.println("11. Complete Transfer Audit History & System Analytics");
        System.out.println(" 0. Exit Console");
        System.out.println("----------------------------------------------------------------------------------------");
    }

    private void handleStudentSwitcher(Scanner scanner) {
        System.out.println("\n--- REGISTERED STUDENTS ---");
        List<Student> students = studentService.getAll();
        for (Student s : students) {
            String activeMarker = (currentStudent != null && currentStudent.getStudentId().equals(s.getStudentId())) ? " [*ACTIVE*]" : "";
            System.out.printf("[%d] %-16s | %-10s | %-20s | %s%s\n",
                    s.getStudentId(), s.getName(), s.getRollNo(), s.getEmail(), s.getDepartment(), activeMarker);
        }
        System.out.print("\nEnter Student ID to activate (or press Enter to cancel): ");
        String line = scanner.nextLine().trim();
        if (!line.isEmpty()) {
            int id = Integer.parseInt(line);
            currentStudent = studentService.getById(id);
            System.out.println("[SUCCESS] Switched active student to: " + currentStudent.getName() + " (" + currentStudent.getRollNo() + ")\n");
        }
    }

    private void handleStudentRegistration(Scanner scanner) {
        System.out.println("\n--- REGISTER NEW STUDENT ---");
        System.out.print("Full Name: ");
        String name = scanner.nextLine().trim();
        System.out.print("Roll Number (e.g. 23CS105): ");
        String roll = scanner.nextLine().trim();
        System.out.print("Campus Email (e.g. student@sece.ac.in): ");
        String email = scanner.nextLine().trim();
        System.out.print("Department (e.g. Computer Science): ");
        String dept = scanner.nextLine().trim();
        System.out.print("Year of Study (1-4): ");
        int year = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Contact Number: ");
        String contact = scanner.nextLine().trim();

        Student student = new Student();
        student.setName(name);
        student.setRollNo(roll);
        student.setEmail(email);
        student.setPasswordHash("pass123");
        student.setDepartment(dept);
        student.setYearOfStudy(year);
        student.setContactNo(contact);

        Student registered = studentService.register(student);
        currentStudent = registered;
        System.out.println("[SUCCESS] Registered new student: " + registered.getName() + " with ID #" + registered.getStudentId());
        System.out.println("Switched to active student!\n");
    }

    private void handleBrowseActivities(Scanner scanner) {
        System.out.println("\n--- CAMPUS ACTIVITIES ---");
        System.out.print("Filter by Category (WORKSHOP / EVENT / LAB_SESSION / SPORTS / CLUB_ACTIVITY or ALL): ");
        String cat = scanner.nextLine().trim();
        System.out.print("Search title/venue (or press Enter for all): ");
        String search = scanner.nextLine().trim();

        List<CampusActivity> list = activityService.getAll(cat.isEmpty() ? null : cat, search.isEmpty() ? null : search);
        if (list.isEmpty()) {
            System.out.println("No campus activities found matching the criteria.\n");
            return;
        }

        System.out.println("---------------------------------------------------------------------------------------------------------");
        System.out.printf("%-4s | %-13s | %-32s | %-22s | %-16s | %s\n", "ID", "CATEGORY", "TITLE", "VENUE", "DATE", "TOKENS");
        System.out.println("---------------------------------------------------------------------------------------------------------");
        for (CampusActivity ca : list) {
            String dateStr = ca.getActivityDate() != null ? ca.getActivityDate().format(dtf) : "N/A";
            System.out.printf("%-4d | %-13s | %-32.32s | %-22.22s | %-16s | %d available\n",
                    ca.getActivityId(), ca.getCategory(), ca.getTitle(), ca.getVenue(), dateStr,
                    ca.getAvailableTokenCount() != null ? ca.getAvailableTokenCount() : 0);
        }
        System.out.println("---------------------------------------------------------------------------------------------------------\n");
    }

    private void handleAddActivity(Scanner scanner) {
        System.out.println("\n--- ADD NEW CAMPUS ACTIVITY ---");
        System.out.print("Activity Title: ");
        String title = scanner.nextLine().trim();
        System.out.print("Category (WORKSHOP / EVENT / LAB_SESSION / SPORTS / CLUB_ACTIVITY): ");
        String cat = scanner.nextLine().trim().toUpperCase();
        System.out.print("Venue: ");
        String venue = scanner.nextLine().trim();
        System.out.print("Organizer: ");
        String organizer = scanner.nextLine().trim();
        System.out.print("Description: ");
        String desc = scanner.nextLine().trim();
        System.out.print("Activity Date & Time (YYYY-MM-DD HH:MM, e.g. 2026-11-10 14:00): ");
        String dtStr = scanner.nextLine().trim();
        LocalDateTime dt = LocalDateTime.parse(dtStr.replace(" ", "T"));
        System.out.print("Capacity (e.g. 50): ");
        int cap = Integer.parseInt(scanner.nextLine().trim());

        ActivityCreateDto dto = new ActivityCreateDto();
        dto.setTitle(title);
        dto.setCategory(cat);
        dto.setVenue(venue);
        dto.setOrganizer(organizer);
        dto.setDescription(desc);
        dto.setActivityDate(dt);
        dto.setTotalCapacity(cap);

        CampusActivity created = activityService.create(dto);
        System.out.println("[SUCCESS] Campus Activity created with ID #" + created.getActivityId() + "\n");
    }

    private void handleBrowseTokens(Scanner scanner) {
        System.out.println("\n--- BROWSE MARKETPLACE TOKENS ---");
        System.out.print("Filter by Status (AVAILABLE / TRANSFER_PENDING / TRANSFERRED / USED / EXPIRED / ALL): ");
        String status = scanner.nextLine().trim();
        System.out.print("Search keyword (or press Enter): ");
        String q = scanner.nextLine().trim();

        List<DigitalToken> tokens = tokenService.getTokens(null, null, null, status.isEmpty() ? "AVAILABLE" : status, q.isEmpty() ? null : q, null, null);
        if (tokens.isEmpty()) {
            System.out.println("No tokens found matching the criteria.\n");
            return;
        }

        System.out.println("-----------------------------------------------------------------------------------------------------------------------------");
        System.out.printf("%-4s | %-18s | %-14s | %-24s | %-18s | %-16s | %s\n",
                "ID", "CODE", "STATUS", "ACTIVITY", "OWNER", "EXPIRY", "SEAT/SLOT");
        System.out.println("-----------------------------------------------------------------------------------------------------------------------------");
        for (DigitalToken t : tokens) {
            String exp = t.getExpiryDate() != null ? t.getExpiryDate().format(dtf) : "N/A";
            System.out.printf("%-4d | %-18s | %-14s | %-24.24s | %-18.18s | %-16s | %s\n",
                    t.getTokenId(), t.getTokenCode(), t.getStatus(),
                    t.getActivityTitle() != null ? t.getActivityTitle() : "Activity #" + t.getActivityId(),
                    t.getOwnerName() != null ? t.getOwnerName() : "Student #" + t.getOwnerStudentId(),
                    exp, t.getSeatOrSlot());
        }
        System.out.println("-----------------------------------------------------------------------------------------------------------------------------\n");
    }

    private void handleCreateToken(Scanner scanner) {
        checkLoggedIn();
        System.out.println("\n--- LIST A NEW DIGITAL TOKEN ---");
        System.out.println("Listing token for Owner: " + currentStudent.getName() + " (" + currentStudent.getRollNo() + ")");

        System.out.print("Enter Campus Activity ID (press 3 in main menu to view activities): ");
        int actId = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Seat or Slot description (e.g. Seat B-12 / Lab Sim #2): ");
        String slot = scanner.nextLine().trim();
        System.out.print("Expiry Date & Time (YYYY-MM-DD HH:MM, e.g. 2026-10-30 23:59): ");
        String expStr = scanner.nextLine().trim();
        LocalDateTime exp = LocalDateTime.parse(expStr.replace(" ", "T"));
        System.out.print("Remarks/Notes: ");
        String remarks = scanner.nextLine().trim();

        TokenCreateDto dto = new TokenCreateDto();
        dto.setActivityId(actId);
        dto.setOwnerStudentId(currentStudent.getStudentId());
        dto.setValidFrom(LocalDateTime.now());
        dto.setExpiryDate(exp);
        dto.setSeatOrSlot(slot);
        dto.setRemarks(remarks);

        DigitalToken created = tokenService.createToken(dto);
        System.out.println("[SUCCESS] Created token listing with code: " + created.getTokenCode() + " (ID #" + created.getTokenId() + ")\n");
    }

    private void handleRequestTransfer(Scanner scanner) {
        checkLoggedIn();
        System.out.println("\n--- REQUEST A TOKEN TRANSFER ---");
        System.out.println("Requester: " + currentStudent.getName() + " (" + currentStudent.getRollNo() + ")");
        System.out.print("Enter Token ID to request (press 5 in main menu to browse available tokens): ");
        int tokenId = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Enter reason for request: ");
        String reason = scanner.nextLine().trim();

        TransferRequestDto dto = new TransferRequestDto(tokenId, currentStudent.getStudentId(), reason);
        TokenTransferRequest req = transferService.requestTransfer(dto);
        System.out.println("[SUCCESS] Transfer request submitted! Request ID: #" + req.getRequestId());
        System.out.println("Status: " + req.getRequestStatus() + ". Owner will review your request.\n");
    }

    private void handleManageIncomingRequests(Scanner scanner) {
        checkLoggedIn();
        System.out.println("\n--- MY LISTED TOKENS & INCOMING REQUESTS ---");
        List<DigitalToken> myTokens = tokenService.getByOwner(currentStudent.getStudentId());
        System.out.println("Tokens owned by you: " + myTokens.size());
        for (DigitalToken t : myTokens) {
            System.out.printf("  * [#%d] %s | %s | %s | Status: %s | Expiry: %s\n",
                    t.getTokenId(), t.getTokenCode(), t.getActivityTitle(), t.getSeatOrSlot(),
                    t.getStatus(), t.getExpiryDate().format(dtf));
        }

        System.out.println("\n--- INCOMING TRANSFER REQUESTS ---");
        List<TokenTransferRequest> incoming = transferService.getIncomingRequests(currentStudent.getStudentId());
        if (incoming.isEmpty()) {
            System.out.println("No incoming transfer requests found for your tokens.\n");
            return;
        }

        System.out.println("---------------------------------------------------------------------------------------------------------");
        System.out.printf("%-4s | %-16s | %-18s | %-10s | %-10s | %s\n", "REQ#", "TOKEN CODE", "REQUESTER", "STATUS", "DATE", "REASON");
        System.out.println("---------------------------------------------------------------------------------------------------------");
        for (TokenTransferRequest r : incoming) {
            String dt = r.getRequestedAt() != null ? r.getRequestedAt().format(dtf) : "N/A";
            System.out.printf("%-4d | %-16s | %-18.18s | %-10s | %-10s | %s\n",
                    r.getRequestId(), r.getTokenCode(), r.getRequesterName() + " (" + r.getRequesterRollNo() + ")",
                    r.getRequestStatus(), dt, r.getRequestReason());
        }
        System.out.println("---------------------------------------------------------------------------------------------------------");

        System.out.print("\nAction on request? (A: Approve, R: Reject, Enter: Skip): ");
        String action = scanner.nextLine().trim().toUpperCase();
        if ("A".equals(action)) {
            System.out.print("Enter Request ID to APPROVE: ");
            int reqId = Integer.parseInt(scanner.nextLine().trim());
            System.out.print("Enter approval note/remark: ");
            String note = scanner.nextLine().trim();
            TokenTransferRequest approved = transferService.approveTransfer(reqId, currentStudent.getStudentId(), note);
            System.out.println("[SUCCESS] Transfer approved with DBMS row lock! Token ownership transferred to " + approved.getRequesterName() + "\n");
        } else if ("R".equals(action)) {
            System.out.print("Enter Request ID to REJECT: ");
            int reqId = Integer.parseInt(scanner.nextLine().trim());
            System.out.print("Enter rejection reason: ");
            String note = scanner.nextLine().trim();
            transferService.rejectTransfer(reqId, currentStudent.getStudentId(), note);
            System.out.println("[SUCCESS] Request #" + reqId + " rejected.\n");
        }
    }

    private void handleManageOutgoingRequests(Scanner scanner) {
        checkLoggedIn();
        System.out.println("\n--- MY OUTGOING TRANSFER REQUESTS ---");
        List<TokenTransferRequest> outgoing = transferService.getOutgoingRequests(currentStudent.getStudentId());
        if (outgoing.isEmpty()) {
            System.out.println("You have not made any outgoing transfer requests.\n");
            return;
        }

        System.out.println("---------------------------------------------------------------------------------------------------------");
        System.out.printf("%-4s | %-16s | %-18s | %-10s | %-10s | %s\n", "REQ#", "TOKEN CODE", "OWNER", "STATUS", "DATE", "RESPONSE NOTE");
        System.out.println("---------------------------------------------------------------------------------------------------------");
        for (TokenTransferRequest r : outgoing) {
            String dt = r.getRequestedAt() != null ? r.getRequestedAt().format(dtf) : "N/A";
            String note = r.getResponseNote() != null ? r.getResponseNote() : "-";
            System.out.printf("%-4d | %-16s | %-18.18s | %-10s | %-10s | %s\n",
                    r.getRequestId(), r.getTokenCode(), r.getOwnerName(), r.getRequestStatus(), dt, note);
        }
        System.out.println("---------------------------------------------------------------------------------------------------------");

        System.out.print("\nCancel a pending request? (Enter Request ID or press Enter to skip): ");
        String line = scanner.nextLine().trim();
        if (!line.isEmpty()) {
            int reqId = Integer.parseInt(line);
            transferService.cancelTransfer(reqId, currentStudent.getStudentId());
            System.out.println("[SUCCESS] Request #" + reqId + " cancelled.\n");
        }
    }

    private void handleMarkTokenAsUsed(Scanner scanner) {
        checkLoggedIn();
        System.out.println("\n--- REDEEM / MARK TOKEN AS USED ---");
        List<DigitalToken> myTokens = tokenService.getByOwner(currentStudent.getStudentId());
        List<DigitalToken> activeTokens = myTokens.stream()
                .filter(t -> "AVAILABLE".equalsIgnoreCase(t.getStatus()) || "TRANSFERRED".equalsIgnoreCase(t.getStatus()))
                .toList();

        if (activeTokens.isEmpty()) {
            System.out.println("You currently do not have any active/redeemable tokens.\n");
            return;
        }

        System.out.println("Your redeemable tokens:");
        for (DigitalToken t : activeTokens) {
            System.out.printf("  [#%d] %s | %s | %s | Expiry: %s\n",
                    t.getTokenId(), t.getTokenCode(), t.getActivityTitle(), t.getSeatOrSlot(), t.getExpiryDate().format(dtf));
        }

        System.out.print("\nEnter Token ID to redeem/mark as USED (or press Enter to cancel): ");
        String line = scanner.nextLine().trim();
        if (!line.isEmpty()) {
            int tokenId = Integer.parseInt(line);
            DigitalToken used = tokenService.markAsUsed(tokenId, currentStudent.getStudentId());
            System.out.println("[SUCCESS] Token " + used.getTokenCode() + " redeemed and marked as USED.\n");
        }
    }

    private void handleViewHistoryAndStats(Scanner scanner) {
        System.out.println("\n--- MARKETPLACE METRICS & ANALYTICS ---");
        DashboardStats stats = statsService.getDashboardStats();
        System.out.println("Total Tokens: " + stats.getTotalTokens() +
                " | Available: " + stats.getAvailableTokens() +
                " | Pending Requests: " + stats.getPendingTransfers() +
                " | Completed Transfers: " + stats.getCompletedTransfers() +
                " | Used: " + stats.getUsedTokens() +
                " | Expired: " + stats.getExpiredTokens());
        System.out.println("Total Campus Activities: " + stats.getTotalActivities() +
                " | Registered Students: " + stats.getTotalStudents());

        System.out.println("\nTokens By Status: " + stats.getTokensByStatus());
        System.out.println("Tokens By Activity Category: " + stats.getTokensByCategory());

        System.out.println("\n--- RECENT TOKEN TRANSFER AUDIT TRAIL ---");
        List<TokenTransferHistory> history = stats.getRecentTransfers();
        if (history != null && !history.isEmpty()) {
            System.out.println("---------------------------------------------------------------------------------------------------------");
            System.out.printf("%-4s | %-16s | %-16s | %-16s | %-16s | %s\n", "HIST#", "TOKEN CODE", "FROM", "TO", "TRANSFERRED AT", "REMARKS");
            System.out.println("---------------------------------------------------------------------------------------------------------");
            for (TokenTransferHistory h : history) {
                String dt = h.getTransferredAt() != null ? h.getTransferredAt().format(dtf) : "N/A";
                System.out.printf("%-4d | %-16s | %-16.16s | %-16.16s | %-16s | %s\n",
                        h.getHistoryId(), h.getTokenCode(), h.getFromStudentName(), h.getToStudentName(), dt, h.getRemarks());
            }
            System.out.println("---------------------------------------------------------------------------------------------------------");
        } else {
            System.out.println("No transfer history records found.");
        }

        System.out.print("\nRun manual token expiry sweep now? (Y/N): ");
        String runSweep = scanner.nextLine().trim();
        if ("Y".equalsIgnoreCase(runSweep)) {
            int expired = statsService.runManualExpiryCheck();
            System.out.println("[SUCCESS] Expiry sweep completed. Tokens expired in this run: " + expired);
        }
        System.out.println();
    }

    private void checkLoggedIn() {
        if (currentStudent == null) {
            throw new MarketplaceException("Please select or register an active student first (Option 1 or 2).");
        }
    }
}
