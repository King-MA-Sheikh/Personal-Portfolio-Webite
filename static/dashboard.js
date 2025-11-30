// dashboard.js - Enhanced Admin Dashboard JavaScript

class Dashboard {
    constructor() {
        this.isMobile = window.innerWidth <= 1024;
        this.init();
    }

    init() {
        this.initCharts();
        this.initEventListeners();
        this.initModal();
        this.initMobileMenu();
        this.loadDashboardData();
    }

    initCharts() {
        // Enhanced Visitor Chart
        const visitorCtx = document.getElementById('visitorChart');
        if (visitorCtx) {
            this.visitorChart = new Chart(visitorCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Unique Visitors',
                        data: [65, 78, 90, 81, 86, 55, 40],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#2c3e50',
                            bodyColor: '#2c3e50',
                            borderColor: '#3498db',
                            borderWidth: 1,
                            cornerRadius: 10,
                            displayColors: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                                color: '#7f8c8d'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#7f8c8d'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }

        // Enhanced Message Chart
        const messageCtx = document.getElementById('messageChart');
        if (messageCtx) {
            this.messageChart = new Chart(messageCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Job Inquiries', 'Collaborations', 'Freelance', 'Others'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: [
                            '#3498db',
                            '#2ecc71',
                            '#f39c12',
                            '#e74c3c'
                        ],
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                    size: 12,
                                    weight: '600'
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    initEventListeners() {
        // Chart period change with enhanced UX
        const chartPeriod = document.getElementById('chart-period');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => {
                this.showLoading('chart-container');
                setTimeout(() => {
                    this.updateVisitorChart(e.target.value);
                    this.hideLoading('chart-container');
                }, 800);
            });
        }

        // Enhanced message actions
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = e.currentTarget.dataset.id;
                this.viewMessage(messageId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const messageId = e.currentTarget.dataset.id;
                this.deleteMessage(messageId);
            });
        });

        // Enhanced navigation
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavItem(link);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.scrollToSection('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.scrollToSection('messages');
                        break;
                    case '3':
                        e.preventDefault();
                        this.scrollToSection('visitors');
                        break;
                    case 'Escape':
                        this.hideModal();
                        break;
                }
            }
        });

        // Auto-refresh data every 30 seconds
        setInterval(() => {
            this.refreshDashboardData();
        }, 30000);
    }

    initModal() {
        this.modal = document.getElementById('messageModal');
        if (!this.modal) return;

        this.modalClose = document.querySelector('.modal-close');
        this.modalCloseBtn = document.getElementById('modal-close-btn');

        // Enhanced modal close handlers
        [this.modalClose, this.modalCloseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.hideModal();
                });
            }
        });

        // Enhanced outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        // Enhanced reply button
        const replyBtn = document.getElementById('modal-reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', () => {
                this.replyToMessage();
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }

    initMobileMenu() {
        // Create enhanced mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 1.5rem;
            left: 1.5rem;
            z-index: 1002;
            background: linear-gradient(135deg, var(--primary), var(--dark-gray));
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: none;
        `;

        document.body.appendChild(mobileMenuBtn);

        mobileMenuBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('mobile-open');
            mobileMenuBtn.innerHTML = sidebar.classList.contains('mobile-open') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobile) {
                    document.querySelector('.sidebar').classList.remove('mobile-open');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

        this.checkMobileMenu();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 1024;
            this.checkMobileMenu();
        });
    }

    checkMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.style.display = this.isMobile ? 'block' : 'none';
        }
    }

    async loadDashboardData() {
        // Simulate loading data
        this.showLoading('stats-grid');
        
        setTimeout(() => {
            this.hideLoading('stats-grid');
            this.showNotification('Dashboard data loaded successfully', 'success');
        }, 1000);
    }

    async refreshDashboardData() {
        // Simulate data refresh
        console.log('Refreshing dashboard data...');
    }

    async viewMessage(messageId) {
        this.showLoading('messageModal');
        
        // Simulate API call
        setTimeout(() => {
            const message = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Job Opportunity - Full Stack Developer',
                message: `Hello Vaibhav,

I came across your portfolio and I'm impressed with your skills and projects. We have an opening for a Full Stack Developer position at our company that I believe would be a great fit for you.

Your experience with modern web technologies and your problem-solving skills align perfectly with what we're looking for.

Would you be interested in having a chat about potential opportunities?

Best regards,
John Doe
Senior Recruiter
Tech Innovations Inc.`,
                created_at: new Date().toISOString()
            };
            
            this.showMessageModal(message);
            this.hideLoading('messageModal');
            this.markAsRead(messageId);
        }, 800);
    }

    showMessageModal(message) {
        if (!this.modal) return;

        document.getElementById('modal-name').textContent = message.name;
        document.getElementById('modal-email').textContent = message.email;
        document.getElementById('modal-subject').textContent = message.subject;
        document.getElementById('modal-date').textContent = new Date(message.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('modal-message').textContent = message.message;

        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    async markAsRead(messageId) {
        // Update UI immediately
        const row = document.querySelector(`.btn-view[data-id="${messageId}"]`)?.closest('tr');
        if (row) {
            row.classList.remove('unread');
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = 'status-badge status-read';
                statusBadge.textContent = 'Read';
            }
            this.updateUnreadCount();
        }
    }

    async deleteMessage(messageId) {
        if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }

        const row = document.querySelector(`.btn-view[data-id="${messageId}"]`)?.closest('tr');
        if (row) {
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            
            setTimeout(() => {
                row.remove();
                this.updateMessageCount();
                this.showNotification('Message deleted successfully', 'success');
            }, 400);
        }
    }

    replyToMessage() {
        const email = document.getElementById('modal-email').textContent;
        const subject = document.getElementById('modal-subject').textContent;
        
        const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=${encodeURIComponent('\n\n--- Original Message ---\n')}`;
        window.location.href = mailtoLink;
    }

    async updateVisitorChart(period) {
        // Enhanced demo data with realistic patterns
        const demoData = {
            '7': [45, 52, 68, 74, 69, 55, 48],
            '30': Array.from({length: 30}, (_, i) => 40 + Math.sin(i * 0.2) * 20 + Math.random() * 15),
            '90': Array.from({length: 90}, (_, i) => 35 + Math.sin(i * 0.1) * 25 + Math.random() * 20)
        };

        if (this.visitorChart) {
            this.visitorChart.data.datasets[0].data = demoData[period] || demoData['7'];
            this.visitorChart.update('none');
            
            // Smooth transition animation
            this.visitorChart.data.datasets[0]._meta[Object.keys(this.visitorChart.data.datasets[0]._meta)[0]].controller.update();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 100;
            const sectionTop = section.offsetTop - offset;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavItem(activeLink) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeLink.parentElement.classList.add('active');
    }

    updateUnreadCount() {
        const unreadCount = document.querySelectorAll('.status-unread').length;
        const badge = document.querySelector('.nav-link .badge');
        
        if (unreadCount > 0) {
            if (badge) {
                badge.textContent = unreadCount;
            } else {
                const newBadge = document.createElement('span');
                newBadge.className = 'badge';
                newBadge.textContent = unreadCount;
                document.querySelector('.nav-link[href="#messages"]').appendChild(newBadge);
            }
        } else if (badge) {
            badge.remove();
        }
    }

    updateMessageCount() {
        const messageCount = document.querySelectorAll('.data-table tbody tr:not(.no-data)').length;
        const statCards = document.querySelectorAll('.stat-card h3');
        if (statCards.length > 0) {
            statCards[0].textContent = messageCount;
        }
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('loading');
        }
    }

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('loading');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Dashboard();
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
    }
});

// Export for global access
window.Dashboard = Dashboard;