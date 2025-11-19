# 🔧 Fix MongoDB Connection Issue

## ❌ Current Problem
- MongoDB Compass shows: "Failed to connect to localhost:4001"
- MongoDB service is **STOPPED**
- Port confusion: MongoDB runs on **27017**, not 4001

## ✅ Solution

### Understanding the Ports
- **Port 27017** = MongoDB Database Server
- **Port 4001** = Your Express.js Backend API Server

MongoDB Compass should connect to **27017**, not 4001!

---

## 🚀 Step-by-Step Fix

### Option 1: Start MongoDB Service (Requires Admin)

1. **Open PowerShell as Administrator**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Start MongoDB Service**
   ```powershell
   Start-Service -Name MongoDB
   ```

3. **Verify it's running**
   ```powershell
   Get-Service -Name MongoDB
   ```
   Should show: `Status: Running`

4. **Connect in MongoDB Compass**
   - Use connection string: `mongodb://localhost:27017`
   - NOT `mongodb://localhost:4001`

---

### Option 2: Start MongoDB Manually (No Admin Required)

If the service won't start, run MongoDB manually:

1. **Find MongoDB Installation**
   Common locations:
   - `C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe`
   - `C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe`
   - `C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe`

2. **Create Data Directory** (if doesn't exist)
   ```powershell
   mkdir C:\data\db
   ```

3. **Start MongoDB Manually**
   ```powershell
   & "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
   ```
   (Adjust version number to match your installation)

4. **Keep this window open** - MongoDB is now running!

5. **Connect in MongoDB Compass**
   - Use: `mongodb://localhost:27017`

---

### Option 3: Use MongoDB Atlas (Cloud - No Local Install Needed)

If local MongoDB is problematic, use the free cloud option:

1. **Sign up at MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create free account (no credit card needed)

2. **Create Free Cluster**
   - Choose M0 (Free tier)
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Save credentials!

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/electronics_store`

6. **Update Your Project**
   - Create `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/electronics_store
   PORT=4001
   JWT_SECRET=your_secret_key_here
   ```

7. **Start Your Server**
   ```bash
   cd backend
   node server.js
   ```

---

## 🧪 Test the Connection

### Test 1: Check MongoDB is Running
```powershell
# For local MongoDB
Test-NetConnection -ComputerName localhost -Port 27017
```
Should show: `TcpTestSucceeded : True`

### Test 2: Connect with MongoDB Compass
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. Should see databases listed

### Test 3: Start Your Backend Server
```bash
cd backend
node server.js
```
Should see:
```
MongoDB Connected Successfully: 127.0.0.1
Server is running on http://localhost:4001
```

### Test 4: Test API
Open browser: http://localhost:4001/api/products

---

## 🔍 Troubleshooting

### Error: "Service cannot be started"
**Solution:** Run PowerShell as Administrator

### Error: "mongod not found"
**Solution:** MongoDB not installed or not in PATH
- Reinstall MongoDB: https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (cloud option)

### Error: "Port 27017 already in use"
**Solution:** MongoDB is already running!
- Just connect with Compass: `mongodb://localhost:27017`

### Error: "Connection timeout"
**Solution:** 
- Check Windows Firewall
- Verify MongoDB service is running
- Try: `Get-Service -Name MongoDB`

---

## 📝 Quick Commands Reference

```powershell
# Check MongoDB service status
Get-Service -Name MongoDB

# Start MongoDB (as Admin)
Start-Service -Name MongoDB

# Stop MongoDB (as Admin)
Stop-Service -Name MongoDB

# Check if port 27017 is listening
Test-NetConnection -ComputerName localhost -Port 27017

# Start your backend server
cd backend
node server.js
```

---

## ✅ Correct Connection Strings

### For MongoDB Compass:
```
mongodb://localhost:27017
```

### For Your Backend (.env file):
```
MONGODB_URI=mongodb://127.0.0.1:27017/electronics_store
```

### For MongoDB Atlas (Cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/electronics_store
```

---

## 🎯 Summary

1. **MongoDB runs on port 27017** (not 4001)
2. **Your backend API runs on port 4001**
3. **Start MongoDB first**, then start your backend
4. **Connect Compass to 27017**, not 4001
5. **If issues persist**, use MongoDB Atlas (cloud)

---

## 🆘 Still Having Issues?

Try this complete reset:

1. **Uninstall MongoDB** (if installed)
2. **Use MongoDB Atlas** (cloud - easier!)
3. **Update backend/.env** with Atlas connection string
4. **Start backend server**
5. **Test API**: http://localhost:4001/api/products

MongoDB Atlas is often easier than local installation!

