# 📥 Node.js Installation Guide - Step by Step

## 🎯 What You Need to Do

I've opened the Node.js download page in your browser. Follow these steps:

---

## 📋 Step-by-Step Installation

### Step 1: Download Node.js ✅ (Page is open!)

On the Node.js download page:

1. **Choose the LTS version** (Long Term Support - Recommended)
   - Look for the green button that says "LTS" or "Recommended For Most Users"
   - Current LTS version is usually v20.x.x or v22.x.x
   
2. **Click the Windows Installer (.msi)**
   - For 64-bit: `node-v20.x.x-x64.msi`
   - For 32-bit: `node-v20.x.x-x86.msi`
   - Most modern computers are 64-bit

3. **Wait for download to complete**

---

### Step 2: Run the Installer

1. **Locate the downloaded file**
   - Usually in your `Downloads` folder
   - File name: `node-v20.x.x-x64.msi`

2. **Double-click the installer**
   - If prompted by User Account Control, click "Yes"

---

### Step 3: Installation Wizard

Follow the installation wizard:

#### Screen 1: Welcome
- Click **"Next"**

#### Screen 2: License Agreement
- Check **"I accept the terms in the License Agreement"**
- Click **"Next"**

#### Screen 3: Destination Folder
- Default location is fine: `C:\Program Files\nodejs\`
- Click **"Next"**

#### Screen 4: Custom Setup
**IMPORTANT:** Make sure these are selected:
- ✅ **Node.js runtime**
- ✅ **npm package manager**
- ✅ **Online documentation shortcuts**
- ✅ **Add to PATH** (VERY IMPORTANT!)

Click **"Next"**

#### Screen 5: Tools for Native Modules (Optional)
- You can check this box if you want
- It installs Python and Visual Studio Build Tools
- **For this project, it's optional**
- Click **"Next"**

#### Screen 6: Ready to Install
- Click **"Install"**
- Wait for installation (2-3 minutes)

#### Screen 7: Completed
- Click **"Finish"**

---

### Step 4: Verify Installation

**IMPORTANT:** After installation, you MUST restart your terminal!

1. **Close ALL PowerShell/Terminal windows**

2. **Open a NEW PowerShell window**

3. **Run these commands:**

```powershell
node --version
```
Should show: `v20.11.0` (or similar)

```powershell
npm --version
```
Should show: `10.2.4` (or similar)

If you see version numbers, **SUCCESS!** ✅

---

### Step 5: Install Project Dependencies

Now that Node.js is installed, install your project dependencies:

```powershell
# Navigate to your project
cd "d:\Boby Laptop backup\project\backend"

# Install all dependencies
npm install
```

This will install:
- ✅ express
- ✅ mongoose
- ✅ bcryptjs
- ✅ jsonwebtoken
- ✅ cors
- ✅ dotenv (the missing one!)
- ✅ nodemon
- ✅ nodemailer

---

### Step 6: Start Your Server

After installation completes:

```powershell
# Make sure you're in the backend folder
cd "d:\Boby Laptop backup\project\backend"

# Start the server
node server.js
```

You should see:
```
Attempting to connect to MongoDB...
MongoDB Connected Successfully: 127.0.0.1
Database Name: electronics_store
Server is running on http://localhost:4001
```

---

## 🔧 Troubleshooting

### "node is not recognized" after installation

**Solution 1:** Restart your computer
- Node.js was installed but PATH needs system restart
- Restart and try again

**Solution 2:** Manually add to PATH
1. Search for "Environment Variables" in Windows
2. Click "Edit the system environment variables"
3. Click "Environment Variables" button
4. Under "System variables", find "Path"
5. Click "Edit"
6. Add: `C:\Program Files\nodejs\`
7. Click OK on all windows
8. Restart terminal

### Installation fails

**Solution:** Run installer as Administrator
- Right-click the .msi file
- Select "Run as administrator"

### "npm install" fails with permission errors

**Solution:** Run PowerShell as Administrator
- Press Win + X
- Select "Windows PowerShell (Admin)"
- Navigate to backend folder
- Run `npm install`

---

## ✅ Quick Verification Checklist

After installation, verify:

- [ ] Node.js installed: `node --version` shows version
- [ ] npm installed: `npm --version` shows version
- [ ] Dependencies installed: `npm install` in backend folder
- [ ] MongoDB running: Check with `Get-Service MongoDB`
- [ ] Server starts: `node server.js` in backend folder
- [ ] API works: Open http://localhost:4001/api/products

---

## 🎯 What to Do After Installation

1. **Close this terminal and open a NEW one**
2. **Verify Node.js:** `node --version`
3. **Install dependencies:**
   ```powershell
   cd "d:\Boby Laptop backup\project\backend"
   npm install
   ```
4. **Start MongoDB:** Run `start-mongodb.bat` as admin
5. **Start server:** Run `start-server.bat` or `node server.js`
6. **Test API:** Open http://localhost:4001/api/products

---

## 📦 What Gets Installed

### Node.js includes:
- **node.exe** - JavaScript runtime
- **npm** - Package manager
- **npx** - Package runner

### Your project will have:
- All dependencies from package.json
- node_modules folder with 100+ packages
- Everything needed to run your backend

---

## 🎉 After Successful Installation

You'll be able to:
- ✅ Run `node` commands
- ✅ Run `npm` commands
- ✅ Install packages with `npm install`
- ✅ Start your server with `node server.js`
- ✅ Use nodemon for development: `npm run dev`

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Node.js version:** `node --version`
2. **Check npm version:** `npm --version`
3. **Restart computer** if commands don't work
4. **Run terminal as Administrator** if permission errors
5. **Check installation path:** Should be `C:\Program Files\nodejs\`

---

## 🚀 Quick Start After Installation

```powershell
# 1. Open NEW PowerShell
# 2. Verify installation
node --version
npm --version

# 3. Install dependencies
cd "d:\Boby Laptop backup\project\backend"
npm install

# 4. Start MongoDB (if not running)
# Run start-mongodb.bat as Administrator

# 5. Start your server
node server.js

# 6. Test in browser
# Open: http://localhost:4001/api/products
```

---

**The download page is open in your browser. Start the installation now! 🚀**

**Remember: After installation, RESTART YOUR TERMINAL (or computer) before running node commands!**

