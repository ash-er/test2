import React, { useState, useEffect, useRef } from 'react'; // Import useRef

// Main App Component - Manages the overall application flow and state
const App = () => {
  // State to control which main screen is currently visible
  // 'login', 'serviceSelection', 'cloudClientSelection', 'cloudClientsList',
  // 'itsmDashboard', 'reportsAnalytics', 'awsModule', 'azureModule', 'gcpModule'
  const [currentView, setCurrentView] = useState('login');
  // State to hold and display the current date and time in the header
  const [currentDateTime, setCurrentDateTime] = useState('');
  // State to control the visibility of the ticket details modal
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  // State to store the currently selected ticket for modal display
  const [selectedTicket, setSelectedTicket] = useState(null);
  // State to store the type of cloud provider selected (e.g., 'aws', 'azure', 'gcp')
  const [selectedCloudProviderType, setSelectedCloudProviderType] = useState('');

  // Dummy data for dashboard metrics
  const dashboardMetrics = {
    openTickets: 24,
    inProgress: 12,
    resolvedToday: 5,
    slaCompliance: '95%',
  };

  // Combined list of clients, including cloud and ITSM specific ones.
  const allClients = [
    { name: "Global Services Inc.", id: "client-001", cloudRegion: "aws" },
    { name: "Tech Solutions Ltd.", id: "client-002", cloudRegion: "azure" },
    { name: "Innovate Corp.", id: "client-003", cloudRegion: "gcp" },
    { name: "Future Systems", id: "client-004", cloudRegion: "aws" },
    { name: "Alpha Corp", id: "client-005", cloudRegion: "aws" },
    { name: "Beta Solutions", id: "client-006", cloudRegion: "azure" },
    { name: "Gamma Innovations", id: "client-007", cloudRegion: "gcp" },
    { name: "Delta Systems", id: "client-008", cloudRegion: "aws" },
    { name: "Epsilon Tech", id: "client-009", cloudRegion: "azure" },
    { name: "Zeta Dynamics", id: "client-010", cloudRegion: "gcp" },
    { name: "CyberNet Solutions", id: "client-011", cloudRegion: "aws" },
    { name: "DataStream Innovations", id: "client-012", cloudRegion: "azure" },
    { name: "Quantum Logic", id: "client-013", cloudRegion: "gcp" },
    { name: "Evergreen Tech", id: "client-014", cloudRegion: "aws" },
    { name: "Nexus Systems", id: "client-015", cloudRegion: "azure" },
  ];

  // Helper function to get a random client name for dummy data
  const getRandomClientName = () => {
    const randomIndex = Math.floor(Math.random() * allClients.length);
    return allClients[randomIndex].name;
  };

  // Raw ticket data to be processed with IDs and types
  const rawTickets = [
    { title: 'AWS EC2 Instance Performance Issue', customer: getRandomClientName(), priority: 'High', status: 'Open', technology: 'AWS', created: '2025-01-20', dueDate: '2025-01-22', description: 'Users are reporting slow performance and intermittent timeouts when accessing applications hosted on a specific EC2 instance (i-abcdef123456). CPU utilization is spiking, and network I/O seems high. Need to investigate.' },
    { title: 'Azure SQL Database Connectivity', customer: getRandomClientName(), priority: 'Medium', status: 'In Progress', technology: 'Azure', created: '2025-01-19', dueDate: '2025-01-23', description: 'Application "DataSync" is unable to connect to the Azure SQL Database "ProdDB01". Connection string appears correct. Other applications can connect. Firewall rules might be an issue.' },
    { title: 'Linux Server Disk Space Alert', customer: getRandomClientName(), priority: 'Low', status: 'Pending', technology: 'Linux', created: '2025-01-18', dueDate: '2025-01-21', description: 'Alert received: /var partition on Linux server "webserver-01" is at 98% capacity. This could lead to service interruptions. Need to identify large files and clear space.' },
    { title: 'Network Connectivity Issues', customer: getRandomClientName(), priority: 'High', status: 'Open', technology: 'Network', created: '2025-01-20', dueDate: '2025-01-21', description: 'Multiple users in Building 3 reporting complete loss of network connectivity. Cannot access internal resources or internet. Suspect a core switch failure or misconfiguration.' },
    { title: 'GCP Cloud Storage Access Error', customer: getRandomClientName(), priority: 'Critical', status: 'Open', technology: 'GCP', created: '2025-01-21', dueDate: '2025-01-22', description: 'Critical application "ImageProcessor" failing to upload files to GCP Cloud Storage bucket "image-archive". Receiving "Access Denied" errors. Permissions issue likely.' },
    { title: 'Application Deployment Failure', customer: getRandomClientName(), priority: 'Medium', status: 'Resolved', technology: 'DevOps', created: '2025-01-17', dueDate: '2025-01-20', description: 'New version of "CRM-App" failed to deploy to production environment. Rollback initiated. Logs show a dependency mismatch error during installation. Resolved by updating package versions.' },
    { title: 'User Account Lockout', customer: getRandomClientName(), priority: 'Low', status: 'Resolved', technology: 'Security', created: '2025-01-16', dueDate: '2025-01-18', description: 'User John Smith (jsmith) account locked out. Unable to log in to any corporate systems. Appears to be due to multiple failed login attempts. Resolved by resetting password and unlocking account.' },
    { title: 'Printer Not Responding', customer: getRandomClientName(), priority: 'Low', status: 'In Progress', technology: 'Hardware', created: '2025-01-22', dueDate: '2025-01-24', description: 'Office printer "HP-LaserJet-05" in accounting department is offline. Cannot print. Tried power cycling, no change. Need technician to check hardware connection and drivers.' },
    { title: 'VPN Connection Dropping', customer: getRandomClientName(), priority: 'High', status: 'Open', technology: 'Network', created: '2025-01-23', dueDate: '2025-01-25', description: 'Remote users frequently losing VPN connection to corporate network, especially during peak hours. Causes disruption to work. VPN server logs show high load and connection drops.' },
    { title: 'Database Backup Failure', customer: getRandomClientName(), priority: 'Critical', status: 'In Progress', technology: 'Database', created: '2025-01-24', dueDate: '2025-01-26', description: 'Automated nightly backup of "AnalyticsDB" failed. Error message indicates insufficient disk space on backup target. Critical data at risk. Need to clear space or reconfigure backup target.' },
    { title: 'New User Account Creation Request', customer: getRandomClientName(), priority: 'Low', status: 'Open', technology: 'Identity', created: '2025-01-25', dueDate: '2025-01-27', description: 'Request to create a new user account for Sarah Connor with standard access permissions.' },
    { title: 'Software Installation Request', customer: getRandomClientName(), priority: 'Medium', status: 'Pending', technology: 'Software', created: '2025-01-26', dueDate: '2025-01-28', description: 'Request to install "Visual Studio Code" on developer workstation DEV-007.' },
    { title: 'Office 365 License Renewal', customer: getRandomClientName(), priority: 'Low', status: 'Resolved', technology: 'Cloud', created: '2025-01-15', dueDate: '2025-01-17', description: 'Annual renewal of Office 365 licenses for 50 users completed.' },
    { title: 'Server Patching Schedule Inquiry', customer: getRandomClientName(), priority: 'Low', status: 'Open', technology: 'Infrastructure', created: '2025-01-27', dueDate: '2025-01-29', description: 'Inquiry about the next scheduled maintenance window for server patching.' },
  ];

  // Function to determine ticket type (Incident/Service Request) and assign a unique ID
  const assignTicketIdAndType = (ticket, index) => {
    const incidentKeywords = ['issue', 'error', 'failure', 'outage', 'alert', 'problem', 'not responding', 'dropping', 'loss', 'crash'];
    const serviceRequestKeywords = ['request', 'creation', 'installation', 'access', 'upgrade', 'license', 'provisioning', 'decommissioning', 'inquiry'];

    const combinedText = (ticket.title + ' ' + ticket.description).toLowerCase();
    let type = 'Unknown'; // Default type

    const isIncident = incidentKeywords.some(keyword => combinedText.includes(keyword));
    const isServiceRequest = serviceRequestKeywords.some(keyword => combinedText.includes(keyword));

    if (isIncident && !isServiceRequest) {
      type = 'Incident';
    } else if (isServiceRequest && !isIncident) {
      type = 'Service Request';
    } else {
      // If both or neither, make a random choice for dummy data
      type = Math.random() > 0.5 ? 'Incident' : 'Service Request';
    }

    const prefix = type === 'Incident' ? 'INC' : 'SR';
    const idNumber = (index + 1).toString().padStart(3, '0'); // Ensures 001, 002 format
    const newId = `${prefix}-${idNumber}`;

    return { ...ticket, id: newId, type: type };
  };

  // Process allTickets to assign IDs and types
  const processedTickets = rawTickets.map(assignTicketIdAndType);

  // Effect hook to update the current date and time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }));
    };
    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, []);

  // Function to open the ticket details modal
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetailsModal(true);
  };

  // Function to close the ticket details modal
  const handleCloseTicketDetailsModal = () => {
    setShowTicketDetailsModal(false);
    setSelectedTicket(null);
  };

  // Function to handle back navigation based on current view
  const handleBack = () => {
    switch (currentView) {
      case 'itsmDashboard':
      case 'reportsAnalytics':
      case 'dashboard':
        setCurrentView('serviceSelection');
        break;
      case 'cloudClientsList':
        setCurrentView('cloudClientSelection');
        break;
      case 'awsModule':
      case 'azureModule':
      case 'gcpModule':
        setCurrentView('cloudClientsList'); // Go back to the cloud clients list
        break;
      default:
        setCurrentView('login'); // Fallback to login if no clear back path
    }
  };

  // Render the appropriate view based on currentView state
  switch (currentView) {
    case 'login':
      return <LoginScreen onLoginSuccess={() => setCurrentView('serviceSelection')} />;
    case 'serviceSelection':
      return <ServiceSelectionScreen onSelectITSM={() => setCurrentView('itsmDashboard')} onSelectCloud={() => setCurrentView('cloudClientSelection')} />;
    case 'cloudClientSelection':
      return <CloudClientSelectionScreen
        onSelectClient={(clientType) => {
          setSelectedCloudProviderType(clientType);
          setCurrentView('cloudClientsList');
        }}
        onBack={() => setCurrentView('serviceSelection')}
      />;
    case 'cloudClientsList':
      return <CloudClientsListScreen
        selectedCloudType={selectedCloudProviderType}
        allClients={allClients}
        onSelectClientRedirect={(moduleName) => setCurrentView(moduleName)}
        onBack={() => setCurrentView('cloudClientSelection')}
      />;
    case 'itsmDashboard':
    case 'awsModule':
    case 'azureModule':
    case 'gcpModule':
    case 'reportsAnalytics':
    case 'dashboard': // Dashboard is now also part of the main app layout
      return (
        <div className="flex h-screen w-screen font-sans" style={{ background: 'linear-gradient(135deg, #2A2A5A, #6A6ABF)' }}>
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gisd-sidebar-bg text-gisd-text-light flex flex-col justify-between p-6 shadow-lg rounded-r-xl">
            <div>
              <h2 className="text-2xl font-bold mb-8">CMS Cloud Platform</h2>
              <div className="mb-8">
                <p className="text-lg font-semibold">System Administrator</p>
                <span className="text-sm bg-gisd-card-bg px-3 py-1 rounded-full mt-1 inline-block">Admin - All</span>
              </div>
              <nav>
                <ul>
                  <SidebarLink icon="📊" text="Dashboard" section="dashboard" activeSection={currentView} setActiveSection={() => setCurrentView('dashboard')} />
                  <SidebarLink icon="🎫" text="ITSM Dashboard" section="itsmDashboard" activeSection={currentView} setActiveSection={() => setCurrentView('itsmDashboard')} />
                  <SidebarLink icon="☁️" text="Cloud Assists" section="cloudClientSelection" activeSection={currentView.includes('Module') || currentView === 'cloudClientSelection' || currentView === 'cloudClientsList' ? 'cloudClientSelection' : ''} setActiveSection={() => setCurrentView('cloudClientSelection')} />
                  <SidebarLink icon="📈" text="Reports & Analytics" section="reportsAnalytics" activeSection={currentView} setActiveSection={() => setCurrentView('reportsAnalytics')} />
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            {/* Top Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gisd-border">
              <div className="header-left flex items-center gap-4">
                {/* Back Button - Visible only when not on service selection or login */}
                {currentView !== 'serviceSelection' && currentView !== 'login' && (
                  <button
                    className="back-button bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md flex items-center gap-2"
                    onClick={handleBack}
                  >
                    <span className="text-xl">⬅️</span> Back
                  </button>
                )}
                <h1 className="text-3xl font-bold text-gisd-text-light">CMS Cloud Platform</h1>
              </div>
              <div className="header-right flex items-center gap-4">
                <span className="text-lg text-gisd-text-light">{currentDateTime}</span>
                {/* Logout Button - Moved to the right */}
                <button
                  className="logoff-button bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md flex items-center gap-2"
                  onClick={() => setCurrentView('login')} // Go back to login
                >
                  <span className="text-xl">🚪</span> Logout
                </button>
              </div>
            </div>

            {/* Conditional rendering of content based on active section */}
            {currentView === 'dashboard' && <DashboardContent metrics={dashboardMetrics} allClients={allClients} allTickets={processedTickets} />}
            {currentView === 'itsmDashboard' && <TicketDashboardContent allTickets={processedTickets} onViewTicket={handleViewTicket} />}
            {currentView === 'awsModule' && <AwsCloudModule />}
            {currentView === 'azureModule' && <AzureCloudModule />}
            {currentView === 'gcpModule' && <GcpCloudModule />}
            {currentView === 'reportsAnalytics' && <ReportsAnalyticsContent />}
          </div>

          {/* Ticket Details Modal - Rendered conditionally but no longer blocking */}
          {showTicketDetailsModal && selectedTicket && (
            <TicketDetailsModal
              ticket={selectedTicket}
              onClose={handleCloseTicketDetailsModal}
            />
          )}
        </div>
      );
    default:
      return <LoginScreen onLoginSuccess={() => setCurrentView('serviceSelection')} />;
  }
};

// Login Screen Component
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Dummy authentication
    if (username === 'admin' && password === 'admin@123') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="bg-gisd-dark-blue p-8 rounded-xl shadow-2xl w-full max-w-md text-gisd-text-light border border-gisd-border">
        <div className="flex flex-col items-center mb-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Cognizant_Logo.svg/1200px-Cognizant_Logo.svg.png" alt="Cognizant Logo" className="w-40 mb-4" />
          <h1 className="text-3xl font-bold">Login to CMS Cloud Platform</h1>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-lg font-semibold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            className="w-full p-3 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-lg font-semibold mb-2">Password:</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="admin@123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{error}</div>}
        <button
          onClick={handleLogin}
          className="w-full bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

// Service Selection Screen Component
const ServiceSelectionScreen = ({ onSelectITSM, onSelectCloud }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ background: 'linear-gradient(135deg, #2A2A5A, #6A6ABF)' }}>
      <div className="bg-gisd-dark-blue p-8 rounded-xl shadow-2xl w-full max-w-2xl text-gisd-text-light border border-gisd-border text-center">
        <img
          src="https://placehold.co/600x200/4B0082/FFFFFF?text=Service+Modules" // Placeholder image
          alt="Service Modules Overview"
          className="w-full h-auto rounded-lg mb-8 shadow-lg"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x200/4B0082/FFFFFF?text=Image+Not+Found"; }}
        />
        <h2 className="text-3xl font-bold mb-8">Select a Service Module</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ServiceCard
            icon="🎫"
            title="ITSM Assists"
            description="Manage and automate IT Service Management tickets and operations."
            onClick={onSelectITSM}
          />
          <ServiceCard
            icon="☁️"
            title="Cloud Assists"
            description="Automate and manage your cloud infrastructure across providers."
            onClick={onSelectCloud}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Service Card Component
// Modified to accept imageSrc for logos, or fall back to icon (emoji)
const ServiceCard = ({ icon, imageSrc, title, description, onClick }) => (
  <button
    className="bg-gisd-card-bg p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center
               hover:bg-gisd-card-hover transform hover:scale-105 transition-all duration-200 border border-gisd-border"
    onClick={onClick}
  >
    {imageSrc ? (
      <img src={imageSrc} alt={`${title} logo`} className="w-24 h-24 object-contain mb-4" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/4B0082/FFFFFF?text=Logo"; }} />
    ) : (
      <span className="text-6xl mb-4">{icon}</span>
    )}
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gisd-text-light text-sm">{description}</p>
  </button>
);

// Cloud Client Selection Screen Component
const CloudClientSelectionScreen = ({ onSelectClient, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ background: 'linear-gradient(135deg, #2A2A5A, #6A6ABF)' }}>
      <div className="bg-gisd-dark-blue p-8 rounded-xl shadow-2xl w-full max-w-2xl text-gisd-text-light border border-gisd-border text-center">
        <h2 className="text-3xl font-bold mb-8">Select a Cloud Provider</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <ServiceCard
            imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png"
            title="AWS"
            description="Amazon Web Services automation and management."
            onClick={() => onSelectClient('aws')} // Pass 'aws' type
          />
          <ServiceCard
            imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Microsoft_Azure_Logo.svg/1024px-Microsoft_Azure_Logo.svg.png"
            title="Azure"
            description="Microsoft Azure automation and management."
            onClick={() => onSelectClient('azure')} // Pass 'azure' type
          />
          <ServiceCard
            imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1200px-Google_Cloud_logo.svg.png"
            title="GCP"
            description="Google Cloud Platform automation and management."
            onClick={() => onSelectClient('gcp')} // Pass 'gcp' type
          />
        </div>
        <button
          onClick={onBack}
          className="mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md"
        >
          Back to Service Selection
        </button>
      </div>
    </div>
  );
};

// NEW: Cloud Clients List Screen Component
const CloudClientsListScreen = ({ selectedCloudType, allClients, onSelectClientRedirect, onBack }) => {
  // Filter clients based on the selected cloud provider type
  const filteredClients = allClients.filter(client => client.cloudRegion === selectedCloudType);

  const getCloudIcon = (cloudType) => {
    switch (cloudType) {
      case 'aws': return '🅰️';
      case 'azure': return '🔵';
      case 'gcp': return '☁️';
      default: return '❓';
    }
  };

  const getCloudName = (cloudType) => {
    switch (cloudType) {
      case 'aws': return 'AWS';
      case 'azure': return 'Azure';
      case 'gcp': return 'GCP';
      default: return 'Unknown Cloud';
    }
  };

  const getCloudLogo = (cloudType) => {
    switch (cloudType) {
      case 'aws': return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png";
      case 'azure': return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Microsoft_Azure_Logo.svg/1024px-Microsoft_Azure_Logo.svg.png";
      case 'gcp': return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/1200px-Google_Cloud_logo.svg.png";
      default: return null; // No image for unknown
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ background: 'linear-gradient(135deg, #2A2A5A, #6A6ABF)' }}>
      <div className="bg-gisd-dark-blue p-8 rounded-xl shadow-2xl w-full max-w-3xl text-gisd-text-light border border-gisd-border text-center">
        <h2 className="text-3xl font-bold mb-8">Clients for {getCloudName(selectedCloudType)} ({filteredClients.length} found)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <ServiceCard
                key={client.id}
                imageSrc={getCloudLogo(selectedCloudType)} // Use the cloud logo for the client card
                title={client.name}
                description={`ID: ${client.id}`}
                onClick={() => onSelectClientRedirect(`${selectedCloudType}Module`)} // Redirect to the specific module
              />
            ))
          ) : (
            <p className="col-span-full text-lg">No clients found for {getCloudName(selectedCloudType)}.</p>
          )}
        </div>
        <button
          onClick={onBack}
          className="mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md"
        >
          Back to Cloud Provider Selection
        </button>
      </div>
    </div>
  );
};


// Sidebar Link Component (Reusable for navigation)
const SidebarLink = ({ icon, text, section, activeSection, setActiveSection }) => (
  <li className="mb-4">
    <button
      className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-all duration-200
        ${activeSection === section ? 'bg-gisd-purple text-white shadow-md' : 'hover:bg-gisd-card-hover'}`}
      onClick={() => setActiveSection(section)}
    >
      <span className="text-2xl">{icon}</span> {text}
    </button>
  </li>
);

// Metric Card Component (Reusable for Dashboard and Ticket Dashboard summaries)
const MetricCard = ({ title, value, colorClass = 'text-white' }) => (
  <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[120px] transition-transform transform hover:scale-105 duration-200 border border-gisd-border">
    <div className={`text-4xl font-bold ${colorClass} mb-2`}>{value}</div>
    <p className="text-gisd-text-light text-lg">{title}</p>
  </div>
);

// Dashboard Content Component
const DashboardContent = ({ metrics, allClients, allTickets }) => {
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterPriority, setFilterPriority] = useState('All Priority');

  // Filter tickets based on selected client, status, and priority
  const filteredClientTickets = allTickets.filter(ticket => {
    const clientMatch = selectedClient === 'All Clients' || ticket.customer === selectedClient;
    const statusMatch = filterStatus === 'All Status' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'All Priority' || ticket.priority === filterPriority;
    return clientMatch && statusMatch && priorityMatch;
  });

  // Calculate metrics for the filtered client tickets
  const clientMetrics = {
    openTickets: filteredClientTickets.filter(t => t.status === 'Open').length,
    inProgress: filteredClientTickets.filter(t => t.status === 'In Progress').length,
    resolved: filteredClientTickets.filter(t => t.status === 'Resolved').length,
    highPriority: filteredClientTickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length,
    mediumPriority: filteredClientTickets.filter(t => t.priority === 'Medium').length,
    lowPriority: filteredClientTickets.filter(t => t.priority === 'Low').length,
    serviceRequests: filteredClientTickets.filter(t => t.type === 'Service Request').length,
    incidents: filteredClientTickets.filter(t => t.type === 'Incident').length,
  };

  return (
    <div className="text-gisd-text-light">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome back, System Administrator!</h2>
      <p className="text-xl mb-8 text-center">Here's your overview for today</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Open Tickets" value={metrics.openTickets} colorClass="text-red-400" />
        <MetricCard title="In Progress" value={metrics.inProgress} colorClass="text-yellow-400" />
        <MetricCard title="Resolved Today" value={metrics.resolvedToday} colorClass="text-green-400" />
        <MetricCard title="SLA Compliance" value={metrics.slaCompliance} colorClass="text-blue-400" />
      </div>

      {/* Client Overview Section with Filters */}
      <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg border border-gisd-border mb-8">
        <h3 className="text-2xl font-bold mb-4">Client Overview</h3>
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <label htmlFor="client-filter" className="text-lg">Filter by Client:</label>
          <select
            id="client-filter"
            className="bg-black bg-opacity-20 text-gisd-text-light border border-gisd-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="All Clients">All Clients</option>
            {allClients.map(client => (
              <option key={client.id} value={client.name}>{client.name}</option>
            ))}
          </select>

          <label htmlFor="status-filter" className="text-lg">Status:</label>
          <select
            id="status-filter"
            className="bg-black bg-opacity-20 text-gisd-text-light border border-gisd-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Pending">Pending</option>
          </select>

          <label htmlFor="priority-filter" className="text-lg">Priority:</label>
          <select
            id="priority-filter"
            className="bg-black bg-opacity-20 text-gisd-text-light border border-gisd-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All Priority">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          <MetricCard title="Open Client Tickets" value={clientMetrics.openTickets} colorClass="text-blue-400" />
          <MetricCard title="Client In Progress" value={clientMetrics.inProgress} colorClass="text-yellow-400" />
          <MetricCard title="Client Resolved" value={clientMetrics.resolved} colorClass="text-green-400" />
          <MetricCard title="Client High Priority" value={clientMetrics.highPriority} colorClass="text-red-400" />
          <MetricCard title="Client Medium Priority" value={clientMetrics.mediumPriority} colorClass="text-yellow-500" />
          <MetricCard title="Client Low Priority" value={clientMetrics.lowPriority} colorClass="text-green-500" />
          <MetricCard title="Client Service Requests" value={clientMetrics.serviceRequests} colorClass="text-purple-400" />
          <MetricCard title="Client Incidents" value={clientMetrics.incidents} colorClass="text-orange-400" />
        </div>
      </div>
    </div>
  );
};

// Ticket Dashboard Content Component
const TicketDashboardContent = ({ allTickets, onViewTicket }) => {
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterPriority, setFilterPriority] = useState('All Priority');

  // Filter tickets based on selected status and priority
  const filteredTickets = allTickets.filter(ticket => {
    const statusMatch = filterStatus === 'All Status' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'All Priority' || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Helper functions to determine color based on priority, status, or technology
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
      case 'Critical':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Resolved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  const getTechnologyColor = (tech) => {
    switch (tech) {
      case 'AWS':
        return 'bg-orange-500';
      case 'Azure':
        return 'bg-blue-600';
      case 'GCP':
        return 'bg-red-600';
      case 'Linux':
        return 'bg-gray-700';
      case 'Network':
        return 'bg-teal-500';
      case 'DevOps':
        return 'bg-indigo-500';
      case 'Security':
        return 'bg-purple-500';
      case 'Hardware':
        return 'bg-pink-500';
      case 'Database':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Calculate summary metrics for all tickets
  const ticketSummaryMetrics = {
    openTickets: allTickets.filter(t => t.status === 'Open').length,
    inProgress: allTickets.filter(t => t.status === 'In Progress').length,
    resolved: allTickets.filter(t => t.status === 'Resolved').length,
    highPriority: allTickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length,
    mediumPriority: allTickets.filter(t => t.priority === 'Medium').length,
    lowPriority: allTickets.filter(t => t.priority === 'Low').length,
    serviceRequests: allTickets.filter(t => t.type === 'Service Request').length,
    incidents: allTickets.filter(t => t.type === 'Incident').length,
  };

  return (
    <div className="text-gisd-text-light">
      <h2 className="text-3xl font-bold mb-6">ITSM Ticket Dashboard - All Technology</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <MetricCard title="Open Tickets" value={ticketSummaryMetrics.openTickets} colorClass="text-blue-400" />
        <MetricCard title="In Progress" value={ticketSummaryMetrics.inProgress} colorClass="text-yellow-400" />
        <MetricCard title="Resolved" value={ticketSummaryMetrics.resolved} colorClass="text-green-400" />
        <MetricCard title="High Priority" value={ticketSummaryMetrics.highPriority} colorClass="text-red-400" />
        <MetricCard title="Medium Priority" value={ticketSummaryMetrics.mediumPriority} colorClass="text-yellow-500" />
        <MetricCard title="Low Priority" value={ticketSummaryMetrics.lowPriority} colorClass="text-green-500" />
        <MetricCard title="Service Requests" value={ticketSummaryMetrics.serviceRequests} colorClass="text-purple-400" />
        <MetricCard title="Incidents" value={ticketSummaryMetrics.incidents} colorClass="text-orange-400" />
      </div>

      {/* Filters for Status and Priority */}
      <div className="flex justify-end gap-4 mb-6">
        <select
          className="bg-gisd-card-bg text-gisd-text-light border border-gisd-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gisd-purple"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          className="bg-gisd-card-bg text-gisd-text-light border border-gisd-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gisd-purple"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All Priority">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Ticket Table Display */}
      <div className="bg-gisd-card-bg rounded-xl shadow-lg overflow-hidden border border-gisd-border">
        <table className="min-w-full divide-y divide-gisd-border">
          <thead className="bg-gisd-dark-blue">
            <tr>
              {['Ticket ID', 'Title', 'Customer', 'Priority', 'Status', 'Technology', 'Created', 'Due Date', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gisd-text-light uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gisd-border">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gisd-card-hover transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gisd-text-light">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gisd-text-light">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gisd-text-light">{ticket.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)} text-white`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)} text-white`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTechnologyColor(ticket.technology)} text-white`}>
                      {ticket.technology}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gisd-text-light">{ticket.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gisd-text-light">{ticket.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-400 hover:text-indigo-600 mr-4 transition-colors duration-150"
                      onClick={() => onViewTicket(ticket)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-400 hover:text-green-600 transition-colors duration-150"
                      onClick={() => alert(`Resolving Ticket: ${ticket.id}`)}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gisd-text-light">No tickets found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Ticket Details Modal Component - Displays detailed ticket information and AI features
const TicketDetailsModal = ({ ticket, onClose }) => {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // States for various AI feature loading, results, and errors
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState('');
  const [aiAnalysisError, setAiAnalysisError] = useState('');

  const [resolutionStepsLoading, setResolutionStepsLoading] = useState(false);
  const [resolutionStepsResult, setResolutionStepsResult] = useState('');
  const [resolutionStepsError, setResolutionStepsError] = useState('');

  const [emailDraftLoading, setEmailDraftLoading] = useState(false);
  const [emailDraftResult, setEmailDraftResult] = useState('');
  const [emailDraftError, setEmailDraftError] = useState('');

  const [kbSuggestLoading, setKbSuggestLoading] = useState(false);
  const [kbSuggestResult, setKbSuggestResult] = useState('');
  const [kbSuggestError, setKbSuggestError] = useState('');

  const [sentimentAnalysisLoading, setSentimentAnalysisLoading] = useState(false);
  const [sentimentAnalysisResult, setSentimentAnalysisResult] = useState('');
  const [sentimentAnalysisError, setSentimentAnalysisError] = useState('');

  const [actionPlanLoading, setActionPlanLoading] = useState(false);
  const [actionPlanResult, setActionPlanResult] = useState('');
  const [actionPlanError, setActionPlanError] = useState('');

  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState('');
  const [translationError, setTranslationError] = useState('');

  const [followupQuestionsLoading, setFollowupQuestionsLoading] = useState(false);
  const [followupQuestionsResult, setFollowupQuestionsResult] = useState('');
  const [followupQuestionsError, setFollowupQuestionsError] = useState('');

  const [managementSummaryLoading, setManagementSummaryLoading] = useState(false);
  const [managementSummaryResult, setManagementSummaryResult] = useState('');
  const [managementSummaryError, setManagementSummaryError] = useState('');

  // Effect to set initial position (centered) and handle window resize
  useEffect(() => {
    const setInitialPosition = () => {
      if (modalRef.current) {
        const modalWidth = modalRef.current.offsetWidth;
        const modalHeight = modalRef.current.offsetHeight;
        setPosition({
          x: (window.innerWidth - modalWidth) / 2,
          y: (window.innerHeight - modalHeight) / 2,
        });
      }
    };

    setInitialPosition(); // Set initial position on mount

    window.addEventListener('resize', setInitialPosition); // Recenter on resize
    return () => window.removeEventListener('resize', setInitialPosition); // Cleanup
  }, [ticket]); // Re-center if ticket changes (e.g., new modal instance)

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    // Only start dragging if the click is on the header area (the h2's parent div)
    // This prevents dragging when clicking on interactive elements within the modal body
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input') || e.target.closest('select')) {
        return;
    }

    setIsDragging(true);
    if (modalRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - modalRect.left,
        y: e.clientY - modalRect.top,
      });
    }
    e.preventDefault(); // Prevent text selection during drag
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    // Boundary checks to keep the modal within the viewport
    const modalWidth = modalRef.current ? modalRef.current.offsetWidth : 0;
    const modalHeight = modalRef.current ? modalRef.current.offsetHeight : 0;

    newX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);


  // Function to call backend for AI analysis of the ticket
  const handleAnalyzeTicketWithAI = async () => {
    setAiAnalysisLoading(true);
    setAiAnalysisResult('');
    setAiAnalysisError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    try {
      const response = await fetch('/analyze-ticket-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketDescription: ticketDescriptionForAI }),
      });

      const result = await response.json();

      if (response.ok) {
        setAiAnalysisResult(result.analysisResult);
      } else {
        setAiAnalysisError(`Failed to get AI analysis: ${result.error || 'Unknown error.'}`);
        console.error('Backend API error:', result);
      }
    } catch (error) {
      setAiAnalysisError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Function to generate resolution steps using Gemini API (frontend direct call)
  const handleGenerateResolutionSteps = async () => {
    setResolutionStepsLoading(true);
    setResolutionStepsResult('');
    setResolutionStepsError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    const prompt = `Based on the following ITSM ticket, provide detailed troubleshooting and resolution steps.
    Focus on practical, actionable steps. Format the steps as a numbered list.

    Ticket Details:
    "${ticketDescriptionForAI}"

    Provide the resolution steps as a numbered list. Do not include any introductory or concluding remarks.
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setResolutionStepsResult(result.candidates[0].content.parts[0].text);
      } else {
        setResolutionStepsError(`Failed to generate resolution steps: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setResolutionStepsError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setResolutionStepsLoading(false);
    }
  };

  // Function to draft customer email using Gemini API (frontend direct call)
  const handleDraftCustomerEmail = async () => {
    setEmailDraftLoading(true);
    setEmailDraftResult('');
    setEmailDraftError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    const prompt = `Draft a concise and professional customer-facing email based on the following ITSM ticket.
    The email should provide an update or request for more information, depending on the ticket's status and description.
    Assume the email is from "IT Support Team".

    Ticket Details:
    "${ticketDescriptionForAI}"

    Example scenarios:
    - If status is 'Open' or 'In Progress' and description implies more info is needed, ask for it.
    - If status is 'In Progress' and investigation is ongoing, provide a brief update.
    - If status is 'Resolved', draft a resolution notification.

    Do not include any introductory or concluding remarks outside the email content itself.
    Include Subject, To, and Body.
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setEmailDraftResult(result.candidates[0].content.parts[0].text);
      } else {
        setEmailDraftError(`Failed to draft email: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setEmailDraftError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setEmailDraftLoading(false);
    }
  };

  // Function to suggest KB articles using Gemini API (frontend direct call)
  const handleSuggestKbArticles = async () => {
    setKbSuggestLoading(true);
    setKbSuggestResult('');
    setKbSuggestError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nPriority: ${ticket.priority}`;

    const prompt = `Based on the following ITSM ticket, suggest 3-5 relevant knowledge base article titles.
    Format them as a numbered list of titles only.

    Ticket Details:
    "${ticketDescriptionForAI}"

    Provide the suggested article titles as a numbered list. Do not include any introductory or concluding remarks.
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setKbSuggestResult(result.candidates[0].content.parts[0].text);
      } else {
        setKbSuggestError(`Failed to suggest KB articles: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setKbSuggestError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setKbSuggestLoading(false);
    }
  };

  // Function to analyze sentiment using Gemini API (frontend direct call)
  const handleAnalyzeSentiment = async () => {
    setSentimentAnalysisLoading(true);
    setSentimentAnalysisResult('');
    setSentimentAnalysisError('');

    const prompt = `Analyze the sentiment of the following customer ticket description.
    Classify the sentiment as one of: Positive, Neutral, Negative, or Mixed.
    Also provide a very brief explanation (1-2 sentences) for the classification.

    Ticket Description: "${ticket.description}"

    Format your response as:
    Sentiment: [Classification]
    Explanation: [Brief explanation]
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setSentimentAnalysisResult(result.candidates[0].content.parts[0].text);
      } else {
        setSentimentAnalysisError(`Failed to analyze sentiment: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setSentimentAnalysisError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setSentimentAnalysisLoading(false);
    }
  };

  // Function to generate action plan using Gemini API (frontend direct call)
  const handleGenerateActionPlan = async () => {
    setActionPlanLoading(true);
    setActionPlanResult('');
    setActionPlanError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    const prompt = `Generate a comprehensive action plan for resolving the following ITSM ticket.
    Include estimated timelines (e.g., "within 2 hours", "by end of day", "next business day") and suggest potential resources or teams involved.
    Format the action plan as a numbered list of steps with sub-points for details.

    Ticket Details:
    "${ticketDescriptionForAI}"

    Provide the action plan as a numbered list. Do not include any introductory or concluding remarks.
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setActionPlanResult(result.candidates[0].content.parts[0].text);
      } else {
        setActionPlanError(`Failed to generate action plan: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setActionPlanError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setActionPlanLoading(false);
    }
  };

  // Function to translate description using Gemini API (frontend direct call)
  const handleTranslateDescription = async () => {
    setTranslationLoading(true);
    setTranslationResult('');
    setTranslationError('');

    const prompt = `Translate the following ticket description into Spanish.
    Only provide the translated text.

    Ticket Description: "${ticket.description}"
    `;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setTranslationResult(result.candidates[0].content.parts[0].text);
      } else {
        setTranslationError(`Failed to translate description: ${result.error?.message || 'Unknown error.'}`);
        console.error('Gemini API error:', result);
      }
    } catch (error) {
      setTranslationError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setTranslationLoading(false);
    }
  };

  // Function to generate follow-up questions (calls backend API)
  const handleGenerateFollowupQuestions = async () => {
    setFollowupQuestionsLoading(true);
    setFollowupQuestionsResult('');
    setFollowupQuestionsError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    try {
      const response = await fetch('/generate-followup-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketDescription: ticketDescriptionForAI }),
      });

      const result = await response.json();

      if (response.ok) {
        setFollowupQuestionsResult(result.questions);
      } else {
        setFollowupQuestionsError(`Failed to generate follow-up questions: ${result.error || 'Unknown error.'}`);
        console.error('Backend API error:', result);
      }
    } catch (error) {
      setFollowupQuestionsError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setFollowupQuestionsLoading(false);
    }
  };

  // Function to summarize for management (calls backend API)
  const handleGenerateManagementSummary = async () => {
    setManagementSummaryLoading(true);
    setManagementSummaryResult('');
    setManagementSummaryError('');

    const ticketDescriptionForAI = `Ticket ID: ${ticket.id}\nSubject: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`;

    try {
      const response = await fetch('/summarize-for-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketDescription: ticketDescriptionForAI }),
      });

      const result = await response.json();

      if (response.ok) {
        setManagementSummaryResult(result.summary);
      } else {
        setManagementSummaryError(`Failed to generate management summary: ${result.error || 'Unknown error.'}`);
        console.error('Backend API error:', result);
      }
    } catch (error) {
      setManagementSummaryError(`An unexpected error occurred: ${error.message}`);
      console.error('Fetch error:', error);
    } finally {
      setManagementSummaryLoading(false);
    }
  };


  return (
    // Removed the fixed inset-0 and transparent background from this outermost div
    // This div now only serves as the container for the draggable modal itself.
    <div
      ref={modalRef}
      className="bg-gisd-dark-blue p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gisd-border text-gisd-text-light relative"
      style={{
        position: 'fixed', // Position relative to viewport
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100, // Ensure it's on top of other content
      }}
    >
      {/* Draggable header area */}
      <div
        className="absolute inset-x-0 top-0 h-16 flex items-center justify-between px-8 py-4 rounded-t-xl" // Added rounded-t-xl
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <h2 className="text-3xl font-bold text-gisd-text-light">Ticket Details: {ticket.id}</h2>
        <button onClick={onClose} className="text-gisd-text-light hover:text-white text-3xl font-bold">&times;</button>
      </div>

      {/* Content area, adjusted for fixed header */}
      <div className="pt-16"> {/* Add padding-top to push content below the fixed header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p><strong>Type:</strong> {ticket.type}</p>
          <p><strong>Subject:</strong> {ticket.title}</p>
          <p><strong>Customer:</strong> {ticket.customer}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Technology:</strong> {ticket.technology}</p>
          <p><strong>Created:</strong> {ticket.created}</p>
          <p><strong>Due Date:</strong> {ticket.dueDate}</p>
        </div>
        <p className="mb-6"><strong>Description:</strong> {ticket.description}</p>

        {/* AI Feature Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <button
            onClick={handleAnalyzeTicketWithAI}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={aiAnalysisLoading}
          >
            {aiAnalysisLoading && <div className="spinner-sm"></div>}
            Analyze Ticket with AI ✨
          </button>

          <button
            onClick={handleGenerateResolutionSteps}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={resolutionStepsLoading}
          >
            {resolutionStepsLoading && <div className="spinner-sm"></div>}
            Generate Resolution Steps ✨
          </button>

          <button
            onClick={handleDraftCustomerEmail}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={emailDraftLoading}
          >
            {emailDraftLoading && <div className="spinner-sm"></div>}
            Draft Customer Email ✨
          </button>

          <button
            onClick={handleSuggestKbArticles}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={kbSuggestLoading}
          >
            {kbSuggestLoading && <div className="spinner-sm"></div>}
            Suggest KB Articles ✨
          </button>

          <button
            onClick={handleAnalyzeSentiment}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={sentimentAnalysisLoading}
          >
            {sentimentAnalysisLoading && <div className="spinner-sm"></div>}
            Analyze Sentiment ✨
          </button>

          <button
            onClick={handleGenerateActionPlan}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={actionPlanLoading}
          >
            {actionPlanLoading && <div className="spinner-sm"></div>}
            Generate Action Plan ✨
          </button>

          <button
            onClick={handleTranslateDescription}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={translationLoading}
          >
            {translationLoading && <div className="spinner-sm"></div>}
            Translate Description (ES) ✨
          </button>

          <button
            onClick={handleGenerateFollowupQuestions}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={followupQuestionsLoading}
          >
            {followupQuestionsLoading && <div className="spinner-sm"></div>}
            Generate Follow-up Questions ✨
          </button>

          <button
            onClick={handleGenerateManagementSummary}
            className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={managementSummaryLoading}
          >
            {managementSummaryLoading && <div className="spinner-sm"></div>}
            Summarize for Management ✨
          </button>
        </div>

        {/* AI Analysis Result Display */}
        {aiAnalysisError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{aiAnalysisError}</div>
        )}
        {aiAnalysisResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">AI Analysis Result:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {aiAnalysisResult}
            </pre>
          </div>
        )}

        {/* Resolution Steps Result Display */}
        {resolutionStepsError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{resolutionStepsError}</div>
        )}
        {resolutionStepsResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Generated Resolution Steps:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {resolutionStepsResult}
            </pre>
          </div>
        )}

        {/* Email Draft Result Display */}
        {emailDraftError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{emailDraftError}</div>
        )}
        {emailDraftResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Drafted Customer Email:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {emailDraftResult}
            </pre>
          </div>
        )}

        {/* KB Article Suggestion Result Display */}
        {kbSuggestError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{kbSuggestError}</div>
        )}
        {kbSuggestResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Suggested KB Articles:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {kbSuggestResult}
            </pre>
          </div>
        )}

        {/* Sentiment Analysis Result Display */}
        {sentimentAnalysisError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{sentimentAnalysisError}</div>
        )}
        {sentimentAnalysisResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Customer Sentiment Analysis:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {sentimentAnalysisResult}
            </pre>
          </div>
        )}

        {/* Action Plan Result Display */}
        {actionPlanError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{actionPlanError}</div>
        )}
        {actionPlanResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Generated Action Plan:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {actionPlanResult}
            </pre>
          </div>
        )}

        {/* Translation Result Display */}
        {translationError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{translationError}</div>
        )}
        {translationResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Translated Description (ES):</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {translationResult}
            </pre>
          </div>
        )}

        {/* Follow-up Questions Result Display */}
        {followupQuestionsError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{followupQuestionsError}</div>
        )}
        {followupQuestionsResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Generated Follow-up Questions:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {followupQuestionsResult}
            </pre>
          </div>
        )}

        {/* Management Summary Result Display */}
        {managementSummaryError && (
          <div className="bg-red-700 text-white p-4 rounded-lg mb-4">{managementSummaryError}</div>
        )}
        {managementSummaryResult && (
          <div className="bg-gisd-card-bg p-6 rounded-xl border border-gisd-border mb-4">
            <h3 className="text-2xl font-bold mb-4">Management Summary:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded-lg">
              {managementSummaryResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Cloud Assists Content Component - Manages navigation between AWS, Azure, GCP
const CloudAssistsContent = () => {
  const [activeCloudProvider, setActiveCloudProvider] = useState('aws'); // 'aws', 'azure', 'gcp'

  return (
    <div className="text-gisd-text-light">
      <h2 className="text-3xl font-bold mb-6">Cloud Assists</h2>
      <p className="text-xl mb-8">Automate and manage your cloud resources across providers.</p>

      {/* Cloud Provider Navigation Tabs */}
      <div className="flex border-b border-gisd-border mb-6">
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200
            ${activeCloudProvider === 'aws' ? 'bg-gisd-purple text-white shadow-md' : 'hover:bg-gisd-card-hover'}`}
          onClick={() => setActiveCloudProvider('aws')}
        >
          AWS
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200
            ${activeCloudProvider === 'azure' ? 'bg-gisd-purple text-white shadow-md' : 'hover:bg-gisd-card-hover'}`}
          onClick={() => setActiveCloudProvider('azure')}
        >
          Azure
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200
            ${activeCloudProvider === 'gcp' ? 'bg-gisd-purple text-white shadow-md' : 'hover:bg-gisd-card-hover'}`}
          onClick={() => setActiveCloudProvider('gcp')}
        >
          GCP
        </button>
      </div>

      {/* Conditional rendering of cloud provider modules */}
      {activeCloudProvider === 'aws' && <AwsCloudModule />}
      {activeCloudProvider === 'azure' && <AzureCloudModule />}
      {activeCloudProvider === 'gcp' && <GcpCloudModule />}
    </div>
  );
};

// Helper function to show messages (replaces alert/confirm)
// This function is not directly used in the React components, but kept for reference
// if you decide to use it for non-modal messages.
const showMessage = (element, message, type = 'error') => {
  if (element) { // Ensure element exists before manipulating
    element.textContent = message;
    element.className = `p-3 rounded-lg text-white mb-4 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    element.classList.remove('hidden');
    setTimeout(() => {
      element.classList.add('hidden');
    }, 5000); // Hide after 5 seconds
  } else {
    console.warn("Attempted to show message to a non-existent element:", message);
  }
};

// AWS Cloud Module Component
const AwsCloudModule = () => {
  const [cfDescription, setCfDescription] = useState('');
  const [cfTemplate, setCfTemplate] = useState('');
  const [cfLoading, setCfLoading] = useState(false);
  const [cfError, setCfError] = useState('');

  const [deployStackName, setDeployStackName] = useState('');
  const [deployTemplateBody, setDeployTemplateBody] = useState('');
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState('');
  const [deployResult, setDeployResult] = useState('');

  const [ssmTaskDescription, setSsmTaskDescription] = useState('');
  const [ssmInstanceId, setSsmInstanceId] = useState('');
  const [ssmLoading, setSsmLoading] = useState(false);
  const [ssmError, setSsmError] = useState('');
  const [ssmResult, setSsmResult] = useState('');
  const [ssmCommandId, setSsmCommandId] = useState('');

  const [awsCliTaskDescription, setAwsCliTaskDescription] = useState('');
  const [awsCliLoading, setAwsCliLoading] = useState(false);
  const [awsCliError, setAwsCliError] = useState('');
  const [awsCliResult, setAwsCliResult] = useState({ generatedCommand: '', stdout: '', stderr: '' });

  // Effect to highlight code blocks when results change
  useEffect(() => {
    // Check if hljs is available before attempting to highlight
    if (window.hljs) {
      const highlight = (id) => {
        const element = document.getElementById(id);
        if (element) window.hljs.highlightElement(element);
      };
      highlight('cfTemplateCode');
      highlight('awsCliStdout');
      highlight('awsCliStderr');
      highlight('awsCliGeneratedCommand');
    }
  }, [cfTemplate, awsCliResult]);


  const handleGenerateCloudFormation = async () => {
    setCfLoading(true);
    setCfTemplate('');
    setCfError('');
    try {
      const response = await fetch('/generate-cf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceDescription: cfDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setCfTemplate(result.cloudFormationTemplate);
        setDeployTemplateBody(result.cloudFormationTemplate); // Auto-populate for deployment
      } else {
        setCfError(`Error: ${result.error || 'Failed to generate CloudFormation.'}`);
      }
    } catch (error) {
      setCfError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setCfLoading(false);
    }
  };

  const handleDeployCloudFormation = async () => {
    setDeployLoading(true);
    setDeployResult('');
    setDeployError('');
    try {
      const response = await fetch('/deploy-cf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stackName: deployStackName, templateBody: deployTemplateBody }),
      });
      const result = await response.json();
      if (response.ok) {
        setDeployResult(`Stack deployed with ID: ${result.stackId}`);
      } else {
        setDeployError(`Error: ${result.error || 'Failed to deploy CloudFormation.'}`);
      }
    } catch (error) {
      setDeployError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setDeployLoading(false);
    }
  };

  const handleRunSsmTask = async () => {
    setSsmLoading(true);
    setSsmResult('');
    setSsmError('');
    setSsmCommandId('');
    try {
      const response = await fetch('/run-ssm-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: ssmTaskDescription, instanceId: ssmInstanceId }),
      });
      const result = await response.json();
      if (response.ok) {
        setSsmResult(`SSM Command initiated. Command ID: ${result.commandId}. Generated Script: ${result.generatedScript}`);
        setSsmCommandId(result.commandId);
        // In a real app, you'd poll /get-ssm-output using result.commandId
      } else {
        setSsmError(`Error: ${result.error || 'Failed to run SSM task.'}`);
      }
    } catch (error) {
      setSsmError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setSsmLoading(false);
    }
  };

  const handleRunAwsCli = async () => {
    setAwsCliLoading(true);
    setAwsCliResult({ generatedCommand: '', stdout: '', stderr: '' });
    setAwsCliError('');
    try {
      const response = await fetch('/run-aws-cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliTaskDescription: awsCliTaskDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setAwsCliResult(result);
      } else {
        setAwsCliError(`Error: ${result.error || 'Failed to run AWS CLI command.'}`);
      }
    } catch (error) {
      setAwsCliError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setAwsCliLoading(false);
    }
  };

  return (
    <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg border border-gisd-border text-gisd-text-light">
      <h3 className="text-2xl font-bold mb-4">AWS Cloud Automation</h3>

      {/* Generate CloudFormation */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Generate CloudFormation Template</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the AWS resource you want to provision (e.g., "an S3 bucket for logs", "an EC2 instance with a public IP").
          The AI will generate a CloudFormation template.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="cfDescription" className="block text-gisd-text-light mb-2">Resource Description:</label>
          <textarea
            id="cfDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'an S3 bucket for website hosting', 'a Lambda function to process S3 events'"
            value={cfDescription}
            onChange={(e) => setCfDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleGenerateCloudFormation}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={cfLoading}
          >
            {cfLoading && <div className="spinner-sm"></div>}
            Generate CloudFormation
          </button>
        </div>
        {cfError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{cfError}</div>}
        {cfTemplate && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated CloudFormation Template:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-60">
              <code id="cfTemplateCode" className="language-yaml">{cfTemplate}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Deploy CloudFormation */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Deploy CloudFormation Stack</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Enter a stack name and the generated CloudFormation template to deploy it to AWS.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="deployStackName" className="block text-gisd-text-light mb-2">Stack Name:</label>
          <input
            type="text"
            id="deployStackName"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., MyNewWebAppStack"
            value={deployStackName}
            onChange={(e) => setDeployStackName(e.target.value)}
          />
          <label htmlFor="deployTemplateBody" className="block text-gisd-text-light mb-2">Template Body (YAML/JSON):</label>
          <textarea
            id="deployTemplateBody"
            rows="7"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="Paste your CloudFormation YAML/JSON here or generate it above"
            value={deployTemplateBody}
            onChange={(e) => setDeployTemplateBody(e.target.value)}
          ></textarea>
          <button
            onClick={handleDeployCloudFormation}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={deployLoading}
          >
            {deployLoading && <div className="spinner-sm"></div>}
            Deploy Stack
          </button>
        </div>
        {deployError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{deployError}</div>}
        {deployResult && <div className="bg-green-600 text-white p-3 rounded-lg mb-4">{deployResult}</div>}
      </div>

      {/* Run SSM Task */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Run AWS Systems Manager (SSM) Task</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the task you want to run on an EC2 instance (e.g., "install Apache", "restart service X"),
          and provide the instance ID.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="ssmTaskDescription" className="block text-gisd-text-light mb-2">Task Description:</label>
          <textarea
            id="ssmTaskDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., 'install nginx on the server', 'check disk space on /var'"
            value={ssmTaskDescription}
            onChange={(e) => setSsmTaskDescription(e.target.value)}
          ></textarea>
          <label htmlFor="ssmInstanceId" className="block text-gisd-text-light mb-2">EC2 Instance ID:</label>
          <input
            type="text"
            id="ssmInstanceId"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., i-0abcdef1234567890"
            value={ssmInstanceId}
            onChange={(e) => setSsmInstanceId(e.target.value)}
          />
          <button
            onClick={handleRunSsmTask}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={ssmLoading}
          >
            {ssmLoading && <div className="spinner-sm"></div>}
            Run SSM Task
          </button>
        </div>
        {ssmError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{ssmError}</div>}
        {ssmResult && <div className="bg-green-600 text-white p-3 rounded-lg mb-4">{ssmResult}</div>}
      </div>

      {/* Run AWS CLI Command */}
      <div className="p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Run AWS CLI Command</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the AWS CLI command you need to run (e.g., "list all S3 buckets", "describe a specific EC2 instance").
          The AI will generate and execute the command.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="awsCliTaskDescription" className="block text-gisd-text-light mb-2">AWS CLI Task Description:</label>
          <textarea
            id="awsCliTaskDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'list all S3 buckets', 'describe a Compute Engine instance', 'create a new Pub/Sub topic'"
            value={awsCliTaskDescription}
            onChange={(e) => setAwsCliTaskDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleRunAwsCli}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={awsCliLoading}
          >
            {awsCliLoading && <div className="spinner-sm"></div>}
            Generate & Run AWS CLI
          </button>
        </div>
        {awsCliError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{awsCliError}</div>}
        {awsCliResult.generatedCommand && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated Command:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="awsCliGeneratedCommand" className="language-bash">{awsCliResult.generatedCommand}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Output (stdout):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="awsCliStdout" className="language-json">{awsCliResult.stdout}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Errors (stderr):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="awsCliStderr" className="language-bash">{awsCliResult.stderr}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Azure Cloud Module Component
const AzureCloudModule = () => {
  const [armDescription, setArmDescription] = useState('');
  const [armTemplate, setArmTemplate] = useState('');
  const [armLoading, setArmLoading] = useState(false);
  const [armError, setArmError] = useState('');

  const [deployResourceGroup, setDeployResourceGroup] = useState('');
  const [deployArmTemplateBody, setDeployArmTemplateBody] = useState('');
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState('');
  const [deployResult, setDeployResult] = useState('');

  const [azureCommandDescription, setAzureCommandDescription] = useState('');
  const [azureCommandResourceGroup, setAzureCommandResourceGroup] = useState('');
  const [azureCommandVmName, setAzureCommandVmName] = useState('');
  const [azureCommandOsType, setAzureCommandOsType] = useState('Linux'); // Default to Linux
  const [azureCommandLoading, setAzureCommandLoading] = useState(false);
  const [azureCommandError, setAzureCommandError] = useState('');
  const [azureCommandResult, setAzureCommandResult] = useState({ generatedCommand: '', output: '', errorOutput: '' });

  const [azureCliTaskDescription, setAzureCliTaskDescription] = useState('');
  const [azureCliLoading, setAzureCliLoading] = useState(false);
  const [azureCliError, setAzureCliError] = useState('');
  const [azureCliResult, setAzureCliResult] = useState({ generatedCommand: '', stdout: '', stderr: '' });

  // Effect to highlight code blocks when results change
  useEffect(() => {
    if (window.hljs) {
      const highlight = (id) => {
        const element = document.getElementById(id);
        if (element) window.hljs.highlightElement(element);
      };
      highlight('armTemplateCode');
      highlight('azureCommandGeneratedCommand');
      highlight('azureCommandOutput');
      highlight('azureCommandErrorOutput');
      highlight('azureCliStdout');
      highlight('azureCliStderr');
      highlight('azureCliGeneratedCommand');
    }
  }, [armTemplate, azureCommandResult, azureCliResult]);

  const handleGenerateAzureArm = async () => {
    setArmLoading(true);
    setArmTemplate('');
    setArmError('');
    try {
      const response = await fetch('/generate-arm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceDescription: armDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setArmTemplate(result.armTemplate);
        setDeployArmTemplateBody(result.armTemplate); // Auto-populate for deployment
      } else {
        setArmError(`Error: ${result.error || 'Failed to generate ARM template.'}`);
      }
    } catch (error) {
      setArmError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setArmLoading(false);
    }
  };

  const handleDeployAzureArm = async () => {
    setDeployLoading(true);
    setDeployResult('');
    setDeployError('');
    try {
      const response = await fetch('/deploy-arm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceGroupName: deployResourceGroup, templateBody: deployArmTemplateBody }),
      });
      const result = await response.json();
      if (response.ok) {
        setDeployResult(`ARM Template deployed. Deployment Name: ${result.deploymentName}`);
      } else {
        setDeployError(`Error: ${result.error || 'Failed to deploy ARM template.'}`);
      }
    } catch (error) {
      setDeployError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setDeployLoading(false);
    }
  };

  const handleRunAzureCommand = async () => {
    setAzureCommandLoading(true);
    setAzureCommandResult({ generatedCommand: '', output: '', errorOutput: '' });
    setAzureCommandError('');
    try {
      const response = await fetch('/run-azure-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription: azureCommandDescription,
          resourceGroup: azureCommandResourceGroup,
          vmName: azureCommandVmName,
          osType: azureCommandOsType
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setAzureCommandResult(result);
      } else {
        setAzureCommandError(`Error: ${result.error || 'Failed to run Azure command.'}`);
      }
    } catch (error) {
      setAzureCommandError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setAzureCommandLoading(false);
    }
  };

  const handleRunAzureCli = async () => {
    setAzureCliLoading(true);
    setAzureCliResult({ generatedCommand: '', stdout: '', stderr: '' });
    setAzureCliError('');
    try {
      const response = await fetch('/run-azure-cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliTaskDescription: azureCliTaskDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setAzureCliResult(result);
      } else {
        setAzureCliError(`Error: ${result.error || 'Failed to run Azure CLI command.'}`);
      }
    } catch (error) {
      setAzureCliError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setAzureCliLoading(false);
    }
  };


  return (
    <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg border border-gisd-border text-gisd-text-light">
      <h3 className="text-2xl font-bold mb-4">Azure Cloud Automation</h3>

      {/* Generate ARM Template */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Generate Azure Resource Manager (ARM) Template</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the Azure resource you want to provision (e.g., "a storage account for blobs", "a Linux VM").
          The AI will generate an ARM template.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="armDescription" className="block text-gisd-text-light mb-2">Resource Description:</label>
          <textarea
            id="armDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'a storage account for blobs', 'a Linux VM with Ubuntu'"
            value={armDescription}
            onChange={(e) => setArmDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleGenerateAzureArm}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={armLoading}
          >
            {armLoading && <div className="spinner-sm"></div>}
            Generate ARM Template
          </button>
        </div>
        {armError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{armError}</div>}
        {armTemplate && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated ARM Template:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-60">
              <code id="armTemplateCode" className="language-json">{armTemplate}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Deploy ARM Template */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Deploy Azure ARM Template</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Enter a resource group name and the ARM template to deploy it to Azure.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="deployResourceGroup" className="block text-gisd-text-light mb-2">Resource Group Name:</label>
          <input
            type="text"
            id="deployResourceGroup"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., my-new-rg"
            value={deployResourceGroup}
            onChange={(e) => setDeployResourceGroup(e.target.value)}
          />
          <label htmlFor="deployArmTemplateBody" className="block text-gisd-text-light mb-2">Template Body (JSON):</label>
          <textarea
            id="deployArmTemplateBody"
            rows="7"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="Paste your ARM JSON here or generate it above"
            value={deployArmTemplateBody}
            onChange={(e) => setDeployArmTemplateBody(e.target.value)}
          ></textarea>
          <button
            onClick={handleDeployAzureArm}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={deployLoading}
          >
            {deployLoading && <div className="spinner-sm"></div>}
            Deploy ARM Template
          </button>
        </div>
        {deployError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{deployError}</div>}
        {deployResult && <div className="bg-green-600 text-white p-3 rounded-lg mb-4">{deployResult}</div>}
      </div>

      {/* Run Azure Command */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Run Azure Command on VM</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the command to run on an Azure VM, and provide its details.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="azureCommandDescription" className="block text-gisd-text-light mb-2">Command Description:</label>
          <textarea
            id="azureCommandDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., 'install Docker', 'check web server status'"
            value={azureCommandDescription}
            onChange={(e) => setAzureCommandDescription(e.target.value)}
          ></textarea>
          <label htmlFor="azureCommandResourceGroup" className="block text-gisd-text-light mb-2">Resource Group:</label>
          <input
            type="text"
            id="azureCommandResourceGroup"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., my-vm-rg"
            value={azureCommandResourceGroup}
            onChange={(e) => setAzureCommandResourceGroup(e.target.value)}
          />
          <label htmlFor="azureCommandVmName" className="block text-gisd-text-light mb-2">VM Name:</label>
          <input
            type="text"
            id="azureCommandVmName"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., myLinuxVm"
            value={azureCommandVmName}
            onChange={(e) => setAzureCommandVmName(e.target.value)}
          />
          <label htmlFor="azureCommandOsType" className="block text-gisd-text-light mb-2">OS Type:</label>
          <select
            id="azureCommandOsType"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            value={azureCommandOsType}
            onChange={(e) => setAzureCommandOsType(e.target.value)}
          >
            <option value="Linux">Linux</option>
            <option value="Windows">Windows</option>
          </select>
          <button
            onClick={handleRunAzureCommand}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={azureCommandLoading}
          >
            {azureCommandLoading && <div className="spinner-sm"></div>}
            Run Azure Command
          </button>
        </div>
        {azureCommandError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{azureCommandError}</div>}
        {azureCommandResult.generatedCommand && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated Command:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCommandGeneratedCommand" className="language-bash">{azureCommandResult.generatedCommand}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Output:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCommandOutput" className="language-json">{azureCommandResult.output}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Errors:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCommandErrorOutput" className="language-bash">{azureCommandResult.errorOutput}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Run Azure CLI Command */}
      <div className="p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Run Azure CLI Command</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the Azure CLI command you need to run (e.g., "list all resource groups", "show details of a VM").
          The AI will generate and execute the command.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="azureCliTaskDescription" className="block text-gisd-text-light mb-2">Azure CLI Task Description:</label>
          <textarea
            id="azureCliTaskDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'list all resource groups', 'show details of VM myVM in myRG'"
            value={azureCliTaskDescription}
            onChange={(e) => setAzureCliTaskDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleRunAzureCli}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={azureCliLoading}
          >
            {azureCliLoading && <div className="spinner-sm"></div>}
            Generate & Run Azure CLI
          </button>
        </div>
        {azureCliError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{azureCliError}</div>}
        {azureCliResult.generatedCommand && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated Command:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCliGeneratedCommand" className="language-bash">{azureCliResult.generatedCommand}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Output (stdout):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCliStdout" className="language-json">{azureCliResult.stdout}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Errors (stderr):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="azureCliStderr" className="language-bash">{azureCliResult.stderr}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// GCP Cloud Module Component
const GcpCloudModule = () => {
  const [dmDescription, setDmDescription] = useState('');
  const [dmConfig, setDmConfig] = useState('');
  const [dmLoading, setDmLoading] = useState(false);
  const [dmError, setDmError] = useState('');

  const [deployDmName, setDeployDmName] = useState('');
  const [deployDmConfigBody, setDeployDmConfigBody] = useState('');
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState('');
  const [deployResult, setDeployResult] = useState('');

  const [gcpCliTaskDescription, setGcpCliTaskDescription] = useState('');
  const [gcpCliLoading, setGcpCliLoading] = useState(false);
  const [gcpCliError, setGcpCliError] = useState('');
  const [gcpCliResult, setGcpCliResult] = useState({ generatedCommand: '', stdout: '', stderr: '' });

  // Effect to highlight code blocks when results change
  useEffect(() => {
    if (window.hljs) {
      const highlight = (id) => {
        const element = document.getElementById(id);
        if (element) window.hljs.highlightElement(element);
      };
      highlight('dmConfigCode');
      highlight('gcpCliStdout');
      highlight('gcpCliStderr');
      highlight('gcpCliGeneratedCommand');
    }
  }, [dmConfig, gcpCliResult]);

  const handleGenerateGcpDm = async () => {
    setDmLoading(true);
    setDmConfig('');
    setDmError('');
    try {
      const response = await fetch('/generate-gcp-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceDescription: dmDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setDmConfig(result.dmConfig);
        setDeployDmConfigBody(result.dmConfig); // Auto-populate for deployment
      } else {
        setDmError(`Error: ${result.error || 'Failed to generate GCP Deployment Manager config.'}`);
      }
    } catch (error) {
      setDmError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setDmLoading(false);
    }
  };

  const handleDeployGcpDm = async () => {
    setDeployLoading(true);
    setDeployResult('');
    setDeployError('');
    try {
      const response = await fetch('/deploy-gcp-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deploymentName: deployDmName, configBody: deployDmConfigBody }),
      });
      const result = await response.json();
      if (response.ok) {
        setDeployResult(`GCP Deployment initiated. Operation ID: ${result.operationId}`);
      } else {
        setDeployError(`Error: ${result.error || 'Failed to deploy GCP Deployment Manager config.'}`);
      }
    } catch (error) {
      setDmError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setDeployLoading(false);
    }
  };

  const handleRunGcpCli = async () => {
    setGcpCliLoading(true);
    setGcpCliResult({ generatedCommand: '', stdout: '', stderr: '' });
    setGcpCliError('');
    try {
      const response = await fetch('/run-gcp-cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliTaskDescription: gcpCliTaskDescription }),
      });
      const result = await response.json();
      if (response.ok) {
        setGcpCliResult(result);
      } else {
        setGcpCliError(`Error: ${result.error || 'Failed to run GCP CLI command.'}`);
      }
    } catch (error) {
      setGcpCliError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setGcpCliLoading(false);
    }
  };

  return (
    <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg border border-gisd-border text-gisd-text-light">
      <h3 className="text-2xl font-bold mb-4">GCP Cloud Automation</h3>

      {/* Generate Deployment Manager Config */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Generate GCP Deployment Manager Configuration</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the GCP resource you want to provision (e.g., "a GCS bucket", "a Compute Engine instance").
          The AI will generate a Deployment Manager configuration.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="dmDescription" className="block text-gisd-text-light mb-2">Resource Description:</label>
          <textarea
            id="dmDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'a GCS bucket for website assets', 'a Compute Engine instance with Debian'"
            value={dmDescription}
            onChange={(e) => setDmDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleGenerateGcpDm}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={dmLoading}
          >
            {dmLoading && <div className="spinner-sm"></div>}
            Generate GCP DM Config
          </button>
        </div>
        {dmError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{dmError}</div>}
        {dmConfig && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated GCP Deployment Manager Config:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-60">
              <code id="dmConfigCode" className="language-yaml">{dmConfig}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Deploy Deployment Manager Config */}
      <div className="mb-8 p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Deploy GCP Deployment Manager Configuration</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Enter a deployment name and the generated configuration to deploy it to GCP.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="deployDmName" className="block text-gisd-text-light mb-2">Deployment Name:</label>
          <input
            type="text"
            id="deployDmName"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple mb-3"
            placeholder="e.g., my-new-gcp-deployment"
            value={deployDmName}
            onChange={(e) => setDeployDmName(e.target.value)}
          />
          <label htmlFor="deployDmConfigBody" className="block text-gisd-text-light mb-2">Configuration Body (YAML):</label>
          <textarea
            id="deployDmConfigBody"
            rows="7"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="Paste your GCP Deployment Manager YAML here or generate it above"
            value={deployDmConfigBody}
            onChange={(e) => setDeployDmConfigBody(e.target.value)}
          ></textarea>
          <button
            onClick={handleDeployGcpDm}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={deployLoading}
          >
            {deployLoading && <div className="spinner-sm"></div>}
            Deploy GCP DM Config
          </button>
        </div>
        {deployError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{deployError}</div>}
        {deployResult && <div className="bg-green-600 text-white p-3 rounded-lg mb-4">{deployResult}</div>}
      </div>

      {/* Run GCP CLI Command */}
      <div className="p-4 border border-gisd-border rounded-lg bg-black bg-opacity-10">
        <h4 className="text-xl font-semibold mb-3">Run GCP CLI Command</h4>
        <p className="text-sm mb-4 text-gisd-text-light">
          Describe the GCP CLI command you need to run (e.g., "list all GCS buckets", "describe a Compute Engine instance").
          The AI will generate and execute the command.
        </p>
        <div className="input-section mb-4">
          <label htmlFor="gcpCliTaskDescription" className="block text-gisd-text-light mb-2">GCP CLI Task Description:</label>
          <textarea
            id="gcpCliTaskDescription"
            rows="3"
            className="w-full p-2 rounded-lg bg-black bg-opacity-20 border border-gisd-border text-white focus:outline-none focus:ring-2 focus:ring-gisd-purple"
            placeholder="e.g., 'list all GCS buckets', 'describe a Compute Engine instance', 'create a new Pub/Sub topic'"
            value={gcpCliTaskDescription}
            onChange={(e) => setGcpCliTaskDescription(e.target.value)}
          ></textarea>
          <button
            onClick={handleRunGcpCli}
            className="mt-3 bg-gisd-purple text-white px-5 py-2 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            disabled={gcpCliLoading}
          >
            {gcpCliLoading && <div className="spinner-sm"></div>}
            Generate & Run GCP CLI
          </button>
        </div>
        {gcpCliError && <div className="bg-red-700 text-white p-3 rounded-lg mb-4">{gcpCliError}</div>}
        {gcpCliResult.generatedCommand && (
          <div className="result-section mt-4">
            <h5 className="text-lg font-semibold mb-2">Generated Command:</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="gcpCliGeneratedCommand" className="language-bash">{gcpCliResult.generatedCommand}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Output (stdout):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="gcpCliStdout" className="language-json">{gcpCliResult.stdout}</code>
            </pre>
            <h5 className="text-lg font-semibold mt-4 mb-2">Command Errors (stderr):</h5>
            <pre className="bg-black bg-opacity-30 p-3 rounded-lg overflow-auto max-h-40">
              <code id="gcpCliStderr" className="language-bash">{gcpCliResult.stderr}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Reports & Analytics Content Component
const ReportsAnalyticsContent = () => (
  <div className="text-gisd-text-light">
    <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>
    <p className="text-xl mb-8">Generate insights and analyze performance metrics</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReportCard
        icon="📊"
        title="SLA Performance Report"
        description="Monitor SLA compliance and performance metrics"
        buttonText="Generate Report"
        onClick={() => alert('Generating SLA Performance Report...')}
      />
      <ReportCard
        icon="📈"
        title="Ticket Analytics"
        description="Analyze ticket trends and resolution patterns"
        buttonText="Generate Report"
        onClick={() => alert('Generating Ticket Analytics Report...')}
      />
    </div>
  </div>
);

// Report Card Component (Reusable)
const ReportCard = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-gisd-card-bg p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-200 border border-gisd-border">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gisd-text-light mb-6">{description}</p>
    <button
      className="bg-gisd-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-gisd-light-blue transition-colors duration-200 shadow-md"
      onClick={onClick}
    >
      {buttonText}
    </button>
  </div>
);

export default App;
