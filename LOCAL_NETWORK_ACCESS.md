# Local Network Access Configuration Guide

## 🌐 Making Your Wheel of Fortune Game Accessible on Local Network

This guide helps you access the game from other devices on your local network (phones, tablets, other computers).

---

## Step 1: Find Your Local IP Address

### On Windows:
1. Open Command Prompt
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
   - Example: `192.168.1.100` or `10.0.0.5`

---

## Step 2: Configure Frontend

Edit `frontend/.env` file and set your backend IP:

```env
REACT_APP_API_BASE_URL=http://YOUR_IP_ADDRESS:8080
```

**Example:**
```env
REACT_APP_API_BASE_URL=http://192.168.1.100:8080
```

---

## Step 3: Start Both Services

### Backend (Terminal 1):
```bash
cd C:\Users\adeel\Documents\Practice\WheelOfFortune
mvn spring-boot:run
```
✅ Backend accessible at: `http://YOUR_IP_ADDRESS:8080`

### Frontend (Terminal 2):
```bash
cd C:\Users\adeel\Documents\Practice\WheelOfFortune\frontend
npm start
```
✅ Frontend accessible at: `http://YOUR_IP_ADDRESS:3000`

---

## Step 4: Access from Other Devices

From any device on the same network:

### Option 1: Access via IP Address
- Open browser and go to: `http://YOUR_IP_ADDRESS:3000`
- Example: `http://192.168.1.100:3000`

### Option 2: Access via Computer Name (Windows)
- Go to: `http://YOUR_COMPUTER_NAME:3000`
- Example: `http://ADEEL-PC:3000`

---

## Step 5: Configure Windows Firewall (If Needed)

If you can't access from other devices, you may need to allow the ports through Windows Firewall:

### Allow Port 3000 (Frontend):
```powershell
netsh advfirewall firewall add rule name="React Dev Server" dir=in action=allow protocol=TCP localport=3000
```

### Allow Port 8080 (Backend):
```powershell
netsh advfirewall firewall add rule name="Spring Boot Backend" dir=in action=allow protocol=TCP localport=8080
```

---

## 🔧 Changes Made

### 1. Backend (Spring Boot)
- ✅ Configured to bind to `0.0.0.0` (all network interfaces)
- ✅ CORS updated to allow all origins (`*`)
- ✅ Accessible from any device on local network

### 2. Frontend (React)
- ✅ Configured to bind to `0.0.0.0` (all network interfaces)
- ✅ Environment variable support for backend URL
- ✅ Accessible from any device on local network

---

## 📱 Testing

1. **From your PC**: `http://localhost:3000`
2. **From phone/tablet**: `http://YOUR_IP_ADDRESS:3000`
3. **From another PC**: `http://YOUR_IP_ADDRESS:3000`

---

## 🔒 Security Notes

- These settings are for **local network development only**
- Do NOT expose these services to the public internet
- For production deployment, use proper CORS configuration with specific allowed origins

---

## 🐛 Troubleshooting

### Can't access from other devices?

1. **Check your IP address is correct**
   ```bash
   ipconfig
   ```

2. **Verify both services are running**
   - Backend: `http://localhost:8080/api/words/categories`
   - Frontend: `http://localhost:3000`

3. **Check firewall settings**
   - Windows Defender Firewall may be blocking the ports
   - Add firewall rules as shown in Step 5

4. **Ensure devices are on same network**
   - All devices must be connected to the same WiFi/LAN
   - Check your router settings if needed

5. **Restart both services after configuration changes**

---

## 📝 Quick Reference

| Service | Local Access | Network Access |
|---------|--------------|----------------|
| Backend API | http://localhost:8080 | http://YOUR_IP:8080 |
| Frontend | http://localhost:3000 | http://YOUR_IP:3000 |

---

## ✅ Current Configuration

- **Backend binding**: `0.0.0.0:8080`
- **Frontend binding**: `0.0.0.0:3000`
- **CORS Policy**: Allows all origins
- **Environment**: Development mode

Ready to play from any device on your network! 🎮🎉
# Frontend Environment Configuration
# This file allows the frontend to connect to the backend on local network

# Backend API URL - Replace YOUR_IP_ADDRESS with your actual local IP
# To find your IP: Run "ipconfig" in command prompt and look for IPv4 Address
# Example: REACT_APP_API_BASE_URL=http://192.168.1.100:8080

REACT_APP_API_BASE_URL=http://localhost:8080

