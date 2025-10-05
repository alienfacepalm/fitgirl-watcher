@echo off
REM FitGirl Watchlist Extension Build Script for Windows

echo.
echo ========================================
echo FitGirl Watchlist Extension Builder
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo ERROR: package.json not found
    echo Please run this script from the extension root directory
    pause
    exit /b 1
)

REM Parse command line arguments
set PLATFORM=%1
if "%PLATFORM%"=="" set PLATFORM=all

REM Validate platform argument
if not "%PLATFORM%"=="all" if not "%PLATFORM%"=="chrome" if not "%PLATFORM%"=="firefox" (
    echo ERROR: Invalid platform "%PLATFORM%"
    echo Valid platforms: all, chrome, firefox
    echo.
    echo Usage: build.bat [platform]
    echo Examples:
    echo   build.bat
    echo   build.bat chrome
    echo   build.bat firefox
    pause
    exit /b 1
)

REM Run the build
echo Building for platform: %PLATFORM%
echo.
node build.js %PLATFORM%

REM Check if build was successful
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Build completed successfully!
    echo ========================================
    echo.
    echo Output directory: dist\
    echo.
    echo Installation instructions:
    echo.
    if "%PLATFORM%"=="all" (
        echo Chrome/Edge:
        echo   1. Go to chrome://extensions/
        echo   2. Enable "Developer mode"
        echo   3. Click "Load unpacked" and select dist\chrome\
        echo.
        echo Firefox:
        echo   1. Go to about:debugging
        echo   2. Click "This Firefox"
        echo   3. Click "Load Temporary Add-on"
        echo   4. Select dist\firefox\manifest.json
    ) else if "%PLATFORM%"=="chrome" (
        echo Chrome/Edge:
        echo   1. Go to chrome://extensions/
        echo   2. Enable "Developer mode"
        echo   3. Click "Load unpacked" and select dist\chrome\
    ) else if "%PLATFORM%"=="firefox" (
        echo Firefox:
        echo   1. Go to about:debugging
        echo   2. Click "This Firefox"
        echo   3. Click "Load Temporary Add-on"
        echo   4. Select dist\firefox\manifest.json
    )
) else (
    echo.
    echo ========================================
    echo Build failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo Make sure all required files are present.
)

echo.
pause
