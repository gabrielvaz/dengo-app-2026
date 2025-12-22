# In-App Events Strategy - Dengo

## Event Categories

### Engagement Events
- **onboarding_complete** - User finishes initial setup
- **first_card_opened** - User opens first flashcard
- **card_shared** - User shares a card with partner
- **daily_streak_created** - User completes daily streak
- **category_selected** - User selects content category
- **profile_updated** - User updates relationship profile

### Retention Events
- **session_start** - User opens app
- **session_duration** - Time spent in session
- **cards_viewed_per_session** - Number of cards viewed
- **returning_user_day1** - User returns after first day
- **returning_user_day7** - User returns after first week
- **returning_user_day30** - User returns after first month

### Conversion Events
- **premium_intent** - User shows interest in premium features
- **trial_started** - User starts premium trial
- **purchase_initiated** - User begins purchase flow
- **purchase_completed** - User completes purchase
- **purchase_failed** - Purchase attempt failed
- **subscription_renewed** - Subscription renewal

### Content Events
- **card_liked** - User indicates positive response to card
- **card_disliked** - User indicates negative response to card
- **card_saved** - User saves card for later
- **card_reported** - User reports card content
- **category_explored** - User explores specific category
- **content_feedback** - User provides feedback on content

## Event Parameters

### User Parameters
- **relationship_stage** (se-conhecendo, namorando, noivado, casado)
- **time_together** (menos-de-6-meses, 6-meses-a-2-anos, etc.)
- **primary_interests** (comunicacao, romance, intimidade, etc.)
- **app_version** (current version)
- **device_language** (user's device language)

### Content Parameters
- **card_id** (unique identifier for each flashcard)
- **category** (Casais, Almas Gêmeas, etc.)
- **difficulty_level** (leve, medio, profundo)
- **content_sensitivity** (ok, sensitive)
- **estimated_duration** (1min, 2min, 3min)
- **content_theme** (comunicacao, romance, etc.)

### Context Parameters
- **session_number** (nth time user opens app)
- **time_of_day** (morning, afternoon, evening, night)
- **day_of_week** (monday, tuesday, etc.)
- **location** (if relevant and permitted)
- **connection_type** (online, offline)

## Recommended Tracking Tools
- **Firebase Analytics** - For comprehensive event tracking
- **Mixpanel** - For user journey analysis
- **Amplitude** - For behavioral analytics
- **App Store Connect** - For store-specific metrics
- **Custom backend** - For content performance analysis

## Key Performance Indicators (KPIs)

### Engagement KPIs
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration average
- Cards viewed per session
- Return rate (D1, D7, D30)

### Content KPIs
- Card completion rate
- Category preference distribution
- Content sharing rate
- User-generated content (if implemented)
- Content feedback scores

### Retention KPIs
- Day 1 retention rate
- Day 7 retention rate
- Day 30 retention rate
- Weekly retention curve
- Monthly retention curve

### Conversion KPIs
- Premium conversion rate
- Trial to paid conversion
- Average Revenue Per User (ARPU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

## Event Naming Convention
- Use snake_case for all event names
- Prefix with category (engagement_, retention_, conversion_)
- Be descriptive but concise
- Follow consistent parameter naming
- Document all custom events

## Privacy Considerations
- Only collect necessary data
- Implement opt-out mechanisms
- Provide clear privacy policy
- Anonymize sensitive data
- Follow platform guidelines (iOS App Tracking Transparency)
- Obtain proper consent for data collection

## Implementation Priority
1. **Phase 1:** Core engagement and retention events
2. **Phase 2:** Content and conversion events
3. **Phase 3:** Advanced analytics and attribution
4. **Phase 4:** A/B testing and optimization events