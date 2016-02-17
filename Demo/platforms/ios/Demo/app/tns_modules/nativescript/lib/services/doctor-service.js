///<reference path="../.d.ts"/>
"use strict";
var os_1 = require("os");
var semver = require("semver");
var path = require("path");
var DoctorService = (function () {
    function DoctorService($androidToolsInfo, $hostInfo, $logger, $sysInfo) {
        this.$androidToolsInfo = $androidToolsInfo;
        this.$hostInfo = $hostInfo;
        this.$logger = $logger;
        this.$sysInfo = $sysInfo;
    }
    DoctorService.prototype.printWarnings = function () {
        var result = false;
        var sysInfo = this.$sysInfo.getSysInfo(path.join(__dirname, "..", "..", "package.json")).wait();
        if (!sysInfo.adbVer) {
            this.$logger.warn("WARNING: adb from the Android SDK is not installed or is not configured properly.");
            this.$logger.out("For Android-related operations, the NativeScript CLI will use a built-in version of adb." + os_1.EOL
                + "To avoid possible issues with the native Android emulator, Genymotion or connected" + os_1.EOL
                + "Android devices, verify that you have installed the latest Android SDK and" + os_1.EOL
                + "its dependencies as described in http://developer.android.com/sdk/index.html#Requirements" + os_1.EOL);
            this.printPackageManagerTip();
            result = true;
        }
        if (!sysInfo.androidInstalled) {
            this.$logger.warn("WARNING: The Android SDK is not installed or is not configured properly.");
            this.$logger.out("You will not be able to build your projects for Android and run them in the native emulator." + os_1.EOL
                + "To be able to build for Android and run apps in the native emulator, verify that you have" + os_1.EOL
                + "installed the latest Android SDK and its dependencies as described in http://developer.android.com/sdk/index.html#Requirements" + os_1.EOL);
            this.printPackageManagerTip();
            result = true;
        }
        if (this.$hostInfo.isDarwin) {
            if (!sysInfo.xcodeVer) {
                this.$logger.warn("WARNING: Xcode is not installed or is not configured properly.");
                this.$logger.out("You will not be able to build your projects for iOS or run them in the iOS Simulator." + os_1.EOL
                    + "To be able to build for iOS and run apps in the native emulator, verify that you have installed Xcode." + os_1.EOL);
                result = true;
            }
            if (!sysInfo.cocoapodVer) {
                this.$logger.warn("WARNING: CocoaPods is not installed or is not configured properly.");
                this.$logger.out("You will not be able to build your projects for iOS if they contain plugin with CocoaPod file." + os_1.EOL
                    + "To be able to build such projects, verify that you have installed CocoaPods.");
                result = true;
            }
            if (sysInfo.cocoapodVer && semver.valid(sysInfo.cocoapodVer) === null) {
                this.$logger.warn("WARNING: CocoaPods version is not a valid semver version.");
                this.$logger.out("You will not be able to build your projects for iOS if they contain plugin with CocoaPod file." + os_1.EOL
                    + ("To be able to build such projects, verify that you have at least " + DoctorService.MIN_SUPPORTED_POD_VERSION + " version installed."));
                result = true;
            }
            if (sysInfo.cocoapodVer && semver.valid(sysInfo.cocoapodVer) && semver.lt(sysInfo.cocoapodVer, DoctorService.MIN_SUPPORTED_POD_VERSION)) {
                this.$logger.warn("WARNING: CocoaPods version is lower than " + DoctorService.MIN_SUPPORTED_POD_VERSION + ".");
                this.$logger.out("You will not be able to build your projects for iOS if they contain plugin with CocoaPod file." + os_1.EOL
                    + ("To be able to build such projects, verify that you have at least " + DoctorService.MIN_SUPPORTED_POD_VERSION + " version installed."));
                result = true;
            }
        }
        else {
            this.$logger.out("NOTE: You can develop for iOS only on Mac OS X systems.");
            this.$logger.out("To be able to work with iOS devices and projects, you need Mac OS X Mavericks or later." + os_1.EOL);
        }
        var androidToolsIssues = this.$androidToolsInfo.validateInfo().wait();
        var javaVersionIssue = this.$androidToolsInfo.validateJavacVersion(sysInfo.javacVersion).wait();
        return result || androidToolsIssues || javaVersionIssue;
    };
    DoctorService.prototype.printPackageManagerTip = function () {
        if (this.$hostInfo.isWindows) {
            this.$logger.out("TIP: To avoid setting up the necessary environment variables, you can use the chocolatey package manager to install the Android SDK and its dependencies." + os_1.EOL);
        }
        else if (this.$hostInfo.isDarwin) {
            this.$logger.out("TIP: To avoid setting up the necessary environment variables, you can use the Homebrew package manager to install the Android SDK and its dependencies." + os_1.EOL);
        }
    };
    DoctorService.MIN_SUPPORTED_POD_VERSION = "0.38.2";
    return DoctorService;
})();
$injector.register("doctorService", DoctorService);
