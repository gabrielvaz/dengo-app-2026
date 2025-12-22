# Store Submission Checklist - Dengo

## Shared (Apple + Play)
- [ ] App name, bundle ID, and package name are final and consistent
- [ ] Version, build number, and versionCode updated for release
- [ ] Icons, splash, and branding assets are final
- [ ] Privacy Policy URL and Terms of Use URL are public and correct
- [ ] In-app legal links open correctly (Privacy, Terms, Support)
- [ ] Data deletion path works (Profile > delete/reset)
- [ ] No unused permissions or tracking SDKs
- [ ] Content rating decision aligned with app content (romantic/intimacy)
- [ ] Screenshots reflect real UI and current features
- [ ] App works offline as described and handles errors gracefully

## Apple App Store
- [ ] App Store Connect metadata (name, subtitle, description, keywords)
- [ ] App Privacy labels set to "Data Not Collected"
- [ ] Age rating set (likely 17+ if adult/intimacy is kept)
- [ ] App Review Info completed (no login required)
- [ ] Export compliance declared (no encryption or as applicable)
- [ ] Support and marketing URLs added
- [ ] Screenshots uploaded for required device sizes
- [ ] Build signed and uploaded, no crash on launch

## Google Play
- [ ] Play Console listing (short/long description)
- [ ] Data Safety form set to "no data collected"
- [ ] Content rating questionnaire completed (IARC)
- [ ] Target audience set appropriately (not for children)
- [ ] App access set to "all features available without login"
- [ ] Feature graphic and screenshots uploaded
- [ ] Release track created and build uploaded

## Ops / Release
- [ ] EAS projectId set in app.json
- [ ] Signing credentials valid (iOS certificates, Android keystore)
- [ ] Crash-free smoke test on real iOS and Android devices
