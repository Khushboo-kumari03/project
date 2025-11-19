# 📦 Install All Dependencies - Complete Guide

## ✅ Current Status

I've checked your project and here's what I found:

### ✅ Already Installed (in backend/node_modules):
- ✅ **express** (v5.1.0) - Web framework
- ✅ **mongoose** (v8.14.1) - MongoDB ODM
- ✅ **bcryptjs** (v3.0.2) - Password hashing
- ✅ **jsonwebtoken** (v9.0.2) - JWT authentication
- ✅ **cors** (v2.8.5) - Cross-origin resource sharing
- ✅ **nodemon** (v3.1.10) - Auto-restart server
- ✅ **nodemailer** (v7.0.3) - Email functionality

### ⚠️ Missing:
- ❌ **dotenv** - Environment variables (needed but missing)

### ⚠️ Issue:
- ❌ **Node.js/npm not in system PATH** - Can't run npm commands directly

---

## 🎯 Solution Options

### Option 1: Install Node.js (Recommended)

This will give you access to `node` and `npm` commands.

#### Step 1: Download Node.js
1. Go to: https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run the installer

#### Step 2: Installation Settings
- ✅ Check "Automatically install necessary tools"
- ✅ Check "Add to PATH"
- Click "Install"

#### Step 3: Restart
**IMPORTANT:** After installation:
1. Close ALL terminal/PowerShell windows
2. Restart your computer (recommended)
3. Open a NEW terminal

#### Step 4: Verify Installation
```powershell
node --version
npm --version
```

Should show version numbers like:
```
v20.11.0
10.2.4
```

#### Step 5: Install Missing Dependencies
```powershell
cd "d:\Boby Laptop backup\project\backend"
npm install
```

This will install all missing packages including `dotenv`.

---

### Option 2: Use Existing Installation (If Node.js is Already Installed)

If Node.js is installed but not in PATH:

#### Find Node.js Installation
```powershell
# Search for node.exe
Get-ChildItem -Path "C:\" -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

#### Add to PATH Temporarily
```powershell
# Example if found at C:\Program Files\nodejs
$env:Path += ";C:\Program Files\nodejs"

# Verify
node --version
npm --version
```

#### Install Missing Dependencies
```powershell
cd "d:\Boby Laptop backup\project\backend"
npm install
```

---

### Option 3: Manual Installation (If npm Doesn't Work)

If you can't get npm working, I can help you manually install the missing package.

---

## 📋 Complete List of Required Dependencies

### Backend Dependencies (backend/package.json):

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",        // ✅ Password hashing
    "cors": "^2.8.5",            // ✅ CORS support
    "dotenv": "^16.5.0",         // ❌ Environment variables (MISSING)
    "express": "^5.1.0",         // ✅ Web framework
    "jsonwebtoken": "^9.0.2",    // ✅ JWT authentication
    "mongoose": "^8.14.1",       // ✅ MongoDB ODM
    "nodemailer": "^7.0.3",      // ✅ Email support
    "nodemon": "^3.1.10"         // ✅ Development tool
  }
}
```

### Root Dependencies (package.json):

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.14.3"
  }
}
```

---

## 🚀 Quick Install Commands

### If npm is working:

```powershell
# Install backend dependencies
cd "d:\Boby Laptop backup\project\backend"
npm install

# Install root dependencies (optional)
cd "d:\Boby Laptop backup\project"
npm install
```

### Install specific missing package:

```powershell
cd "d:\Boby Laptop backup\project\backend"
npm install dotenv
```

---

## 🔧 Troubleshooting

### "npm is not recognized"

**Cause:** Node.js not installed or not in PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart computer
3. Open NEW terminal
4. Try again

### "EACCES: permission denied"

**Solution:** Run PowerShell as Administrator

### "Cannot find module 'dotenv'"

**Solution:**
```powershell
cd backend
npm install dotenv
```

### "Package-lock.json conflicts"

**Solution:**
```powershell
cd backend
rm package-lock.json
npm install
```

---

## ✅ Verification

After installation, verify all packages:

```powershell
cd backend
npm list --depth=0
```

Should show:
```
backend@1.0.0
├── bcryptjs@3.0.2
├── cors@2.8.5
├── dotenv@16.5.0
├── express@5.1.0
├── jsonwebtoken@9.0.2
├── mongoose@8.14.1
├── nodemailer@7.0.3
└── nodemon@3.1.10
```

---

## 🎯 What Each Package Does

| Package | Purpose | Status |
|---------|---------|--------|
| **express** | Web server framework | ✅ Installed |
| **mongoose** | MongoDB database connection | ✅ Installed |
| **bcryptjs** | Hash passwords securely | ✅ Installed |
| **jsonwebtoken** | Create/verify JWT tokens | ✅ Installed |
| **cors** | Allow cross-origin requests | ✅ Installed |
| **dotenv** | Load environment variables | ❌ Missing |
| **nodemon** | Auto-restart on file changes | ✅ Installed |
| **nodemailer** | Send emails | ✅ Installed |

---

## 🎉 Good News!

**95% of your dependencies are already installed!**

You only need to:
1. Install Node.js (if not installed)
2. Add Node.js to PATH
3. Install the missing `dotenv` package

---

## 📝 Next Steps

1. ✅ Install Node.js from https://nodejs.org/
2. ✅ Restart your computer
3. ✅ Open NEW terminal
4. ✅ Run: `npm install` in backend folder
5. ✅ Start server: `node server.js`

---

## 🆘 Need Help?

If you're having trouble:
1. Check if Node.js is installed: `node --version`
2. Check if npm is available: `npm --version`
3. Make sure you restarted after installing Node.js
4. Try running terminal as Administrator

---

**Most of your packages are already there! Just need to get Node.js in your PATH! 🚀**

