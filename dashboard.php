<?php
// dashboard.php - Enhanced Admin Dashboard
session_start();
require_once 'database/connection.php';

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: auth.php');
    exit();
}

// Get dashboard statistics
$total_messages = 0;
$unread_messages = 0;
$total_visitors = 0;
$recent_messages = [];
$recent_visitors = [];
$today_visitors = 0;

try {
    // Total messages
    $sql = "SELECT COUNT(*) as total FROM contact_messages";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_messages = $stmt->fetch()['total'];

    // Unread messages
    $sql = "SELECT COUNT(*) as unread FROM contact_messages WHERE is_read = FALSE";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $unread_messages = $stmt->fetch()['unread'];

    // Total unique visitors
    $sql = "SELECT COUNT(DISTINCT ip_address) as visitors FROM visitor_stats";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $total_visitors = $stmt->fetch()['visitors'];

    // Today's visitors
    $sql = "SELECT COUNT(DISTINCT ip_address) as today FROM visitor_stats WHERE DATE(visit_time) = CURDATE()";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $today_visitors = $stmt->fetch()['today'];

    // Recent messages (last 5)
    $sql = "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $recent_messages = $stmt->fetchAll();

    // Recent visitors (last 10)
    $sql = "SELECT * FROM visitor_stats ORDER BY visit_time DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $recent_visitors = $stmt->fetchAll();

    // Message types for chart
    $sql = "SELECT 
        SUM(CASE WHEN subject LIKE '%job%' OR subject LIKE '%hire%' OR subject LIKE '%opportunity%' THEN 1 ELSE 0 END) as job_inquiries,
        SUM(CASE WHEN subject LIKE '%collaborat%' OR subject LIKE '%project%' OR subject LIKE '%work%' THEN 1 ELSE 0 END) as collaborations,
        SUM(CASE WHEN subject LIKE '%freelance%' OR subject LIKE '%contract%' THEN 1 ELSE 0 END) as freelance,
        SUM(CASE WHEN subject NOT LIKE '%job%' AND subject NOT LIKE '%hire%' AND subject NOT LIKE '%opportunity%' 
                AND subject NOT LIKE '%collaborat%' AND subject NOT LIKE '%project%' AND subject NOT LIKE '%work%'
                AND subject NOT LIKE '%freelance%' AND subject NOT LIKE '%contract%' THEN 1 ELSE 0 END) as others
        FROM contact_messages";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $message_types = $stmt->fetch();

} catch(PDOException $e) {
    error_log("Dashboard error: " . $e->getMessage());
}

// Calculate performance percentage (demo calculation)
$performance = min(95 + ($total_messages * 0.5) + ($total_visitors * 0.1), 99);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Vaibhav Tiwari Portfolio</title>
    <link rel="stylesheet" href="static/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="media/favicon.ico">
</head>
<body>
    <div class="dashboard-container">
        <!-- Enhanced Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-user-shield"></i> Admin Panel</h2>
                <small>Vaibhav Tiwari Portfolio</small>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li class="nav-item active">
                        <a href="#dashboard" class="nav-link">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#messages" class="nav-link">
                            <i class="fas fa-envelope"></i>
                            <span>Messages</span>
                            <?php if ($unread_messages > 0): ?>
                                <span class="badge"><?php echo $unread_messages; ?></span>
                            <?php endif; ?>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#visitors" class="nav-link">
                            <i class="fas fa-users"></i>
                            <span>Visitors</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="index.html" class="nav-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View Portfolio</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#settings" class="nav-link">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="profile-avatar">
                        <i class="fas fa-user-cog"></i>
                    </div>
                    <div class="profile-info">
                        <strong>Admin User</strong>
                        <span>Administrator</span>
                    </div>
                </div>
                <a href="auth.php?action=logout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </div>
        </aside>

        <!-- Enhanced Main Content -->
        <main class="main-content">
            <!-- Enhanced Header -->
            <header class="dashboard-header">
                <div class="header-left">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Admin! Here's what's happening with your portfolio.</p>
                    <div class="header-stats">
                        <div class="mini-stat">
                            <i class="fas fa-eye"></i>
                            <span><?php echo $total_visitors; ?> Total Visitors</span>
                        </div>
                        <div class="mini-stat">
                            <i class="fas fa-comments"></i>
                            <span><?php echo $total_messages; ?> Messages</span>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <div class="user-details">
                            <strong>Admin User</strong>
                            <span>Last login: <?php echo date('M j, Y g:i A'); ?></span>
                        </div>
                        <div class="user-avatar">
                            <i class="fas fa-user-cog"></i>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Enhanced Stats Cards -->
            <section class="stats-grid" id="dashboard">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-envelope-open-text"></i>
                    </div>
                    <div class="stat-info">
                        <h3><?php echo $total_messages; ?></h3>
                        <p>Total Messages</p>
                        <div class="stat-trend">
                            <i class="fas fa-arrow-up trend-up"></i>
                            <span>+12% this month</span>
                        </div>
                    </div>
                    <div class="stat-badge <?php echo $unread_messages > 0 ? 'badge-warning' : 'badge-success'; ?>">
                        <?php echo $unread_messages; ?> unread
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3><?php echo $total_visitors; ?></h3>
                        <p>Unique Visitors</p>
                        <div class="stat-trend">
                            <i class="fas fa-arrow-up trend-up"></i>
                            <span>+8% this week</span>
                        </div>
                    </div>
                    <div class="stat-badge badge-info">
                        Today: <?php echo $today_visitors; ?>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-project-diagram"></i>
                    </div>
                    <div class="stat-info">
                        <h3>3</h3>
                        <p>Active Projects</p>
                        <div class="stat-trend">
                            <i class="fas fa-check trend-stable"></i>
                            <span>All live</span>
                        </div>
                    </div>
                    <div class="stat-badge badge-success">
                        <i class="fas fa-check"></i> Live
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-info">
                        <h3><?php echo $performance; ?>%</h3>
                        <p>Performance</p>
                        <div class="stat-trend">
                            <i class="fas fa-arrow-up trend-up"></i>
                            <span>+5% improved</span>
                        </div>
                    </div>
                    <div class="stat-badge badge-success">
                        Excellent
                    </div>
                </div>
            </section>

            <!-- Enhanced Charts Section -->
            <section class="charts-section">
                <div class="chart-card">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-line"></i> Visitor Analytics</h3>
                        <div class="chart-controls">
                            <select id="chart-period" class="chart-select">
                                <option value="7">Last 7 Days</option>
                                <option value="30" selected>Last 30 Days</option>
                                <option value="90">Last 90 Days</option>
                            </select>
                            <button class="chart-refresh" id="refresh-chart">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="visitorChart"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="chart-stat">
                                <span class="stat-value"><?php echo $today_visitors; ?></span>
                                <span class="stat-label">Today</span>
                            </div>
                            <div class="chart-stat">
                                <span class="stat-value"><?php echo $total_visitors; ?></span>
                                <span class="stat-label">Total</span>
                            </div>
                            <div class="chart-stat">
                                <span class="stat-value">+8%</span>
                                <span class="stat-label">Growth</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-header">
                        <h3><i class="fas fa-envelope"></i> Message Types</h3>
                        <div class="chart-legend">
                            <span class="legend-item">
                                <span class="legend-color" style="background: #3498db"></span>
                                Job Inquiries
                            </span>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="messageChart"></canvas>
                    </div>
                    <div class="chart-footer">
                        <div class="chart-stats">
                            <div class="chart-stat">
                                <span class="stat-value"><?php echo $message_types['job_inquiries'] ?? 0; ?></span>
                                <span class="stat-label">Job Inquiries</span>
                            </div>
                            <div class="chart-stat">
                                <span class="stat-value"><?php echo $message_types['collaborations'] ?? 0; ?></span>
                                <span class="stat-label">Collaborations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Recent Messages Section -->
            <section class="recent-section" id="messages">
                <div class="section-header">
                    <div class="section-title">
                        <h2><i class="fas fa-envelope"></i> Recent Messages</h2>
                        <p>Latest contact form submissions - Auto Updated</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn-refresh" id="refresh-messages">
                            <i class="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                        <div class="section-badge">
                            <span class="badge"><?php echo count($recent_messages); ?> messages</span>
                            <?php if ($unread_messages > 0): ?>
                                <span class="badge badge-warning"><?php echo $unread_messages; ?> unread</span>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($recent_messages)): ?>
                                <tr>
                                    <td colspan="6" class="no-data">
                                        <i class="fas fa-inbox"></i>
                                        <div>No messages yet</div>
                                        <small>Contact form submissions will appear here automatically</small>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($recent_messages as $message): ?>
                                <tr class="<?php echo !$message['is_read'] ? 'unread' : ''; ?>">
                                    <td><?php echo htmlspecialchars($message['name']); ?></td>
                                    <td><?php echo htmlspecialchars($message['email']); ?></td>
                                    <td><?php echo htmlspecialchars($message['subject']); ?></td>
                                    <td><?php echo date('M j, Y g:i A', strtotime($message['created_at'])); ?></td>
                                    <td>
                                        <span class="status-badge <?php echo $message['is_read'] ? 'status-read' : 'status-unread'; ?>">
                                            <?php echo $message['is_read'] ? 'Read' : 'Unread'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-view" data-id="<?php echo $message['id']; ?>">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn-delete" data-id="<?php echo $message['id']; ?>">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Enhanced Recent Visitors Section -->
            <section class="recent-section" id="visitors">
                <div class="section-header">
                    <div class="section-title">
                        <h2><i class="fas fa-users"></i> Recent Visitors</h2>
                        <p>Website traffic analytics</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn-refresh" id="refresh-visitors">
                            <i class="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                        <div class="section-badge">
                            <span class="badge badge-info"><?php echo count($recent_visitors); ?> visits</span>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <i class="fas fa-globe"></i>
                                    IP Address
                                </th>
                                <th>
                                    <i class="fas fa-file"></i>
                                    Page Visited
                                </th>
                                <th>
                                    <i class="fas fa-clock"></i>
                                    Visit Time
                                </th>
                                <th>
                                    <i class="fas fa-desktop"></i>
                                    User Agent
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($recent_visitors)): ?>
                                <tr>
                                    <td colspan="4" class="no-data">
                                        <i class="fas fa-users"></i>
                                        <div>No visitor data</div>
                                        <small>Visitor analytics will appear here</small>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($recent_visitors as $visitor): ?>
                                <tr>
                                    <td>
                                        <div class="ip-cell">
                                            <i class="fas fa-network-wired"></i>
                                            <?php echo htmlspecialchars($visitor['ip_address']); ?>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="page-cell">
                                            <i class="fas fa-file-alt"></i>
                                            <?php echo htmlspecialchars($visitor['page_visited']); ?>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="time-cell">
                                            <i class="fas fa-calendar-alt"></i>
                                            <?php echo date('M j, Y H:i', strtotime($visitor['visit_time'])); ?>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="user-agent-cell">
                                            <i class="fas fa-desktop"></i>
                                            <span class="user-agent"><?php echo substr(htmlspecialchars($visitor['user_agent']), 0, 60); ?>...</span>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Quick Actions Section -->
            <section class="quick-actions" id="settings">
                <div class="section-header">
                    <h2><i class="fas fa-bolt"></i> Quick Actions</h2>
                    <p>Manage your portfolio efficiently</p>
                </div>
                <div class="actions-grid">
                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-download"></i>
                        </div>
                        <div class="action-content">
                            <h3>Export Data</h3>
                            <p>Download messages and analytics</p>
                        </div>
                        <button class="action-btn">
                            <i class="fas fa-arrow-down"></i>
                            Export
                        </button>
                    </div>
                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="action-content">
                            <h3>Notifications</h3>
                            <p>Manage email alerts</p>
                        </div>
                        <button class="action-btn">
                            <i class="fas fa-cog"></i>
                            Configure
                        </button>
                    </div>
                    <div class="action-card">
                        <div class="action-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="action-content">
                            <h3>Analytics</h3>
                            <p>View detailed reports</p>
                        </div>
                        <button class="action-btn">
                            <i class="fas fa-chart-line"></i>
                            View Reports
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Enhanced Message View Modal -->
    <div id="messageModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-envelope-open-text"></i> Message Details</h3>
                <button class="modal-close" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="message-details">
                    <div class="detail-row">
                        <label><i class="fas fa-user"></i> Name:</label>
                        <span id="modal-name">-</span>
                    </div>
                    <div class="detail-row">
                        <label><i class="fas fa-envelope"></i> Email:</label>
                        <span id="modal-email">-</span>
                    </div>
                    <div class="detail-row">
                        <label><i class="fas fa-tag"></i> Subject:</label>
                        <span id="modal-subject">-</span>
                    </div>
                    <div class="detail-row">
                        <label><i class="fas fa-calendar"></i> Date:</label>
                        <span id="modal-date">-</span>
                    </div>
                    <div class="detail-row full-width">
                        <label><i class="fas fa-comment"></i> Message:</label>
                        <div id="modal-message" class="message-content">
                            No message content available.
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="modal-close-btn">
                    <i class="fas fa-times"></i>
                    Close
                </button>
                <button class="btn btn-primary" id="modal-reply-btn">
                    <i class="fas fa-reply"></i>
                    Reply via Email
                </button>
                <button class="btn btn-info" id="modal-mark-read">
                    <i class="fas fa-check"></i>
                    Mark as Read
                </button>
            </div>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="loading-overlay">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading Dashboard...</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <script src="static/dashboard.js"></script>
</body>
</html>