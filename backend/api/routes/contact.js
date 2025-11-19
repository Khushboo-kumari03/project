const express = require('express');
const router = express.Router();

// Get contact information
router.get('/info', async (req, res) => {
    try {
        const contactInfo = {
            website: 'www.vimagine.com',
            emails: {
                support: 'support@vimagine.com',
                sales: 'sales@vimagine.com'
            },
            address: {
                street: '123 Tech Street',
                city: 'Digital City',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            hours: {
                weekdays: {
                    days: 'Monday - Friday',
                    hours: '9:00 AM - 8:00 PM EST'
                },
                weekend: {
                    saturday: '10:00 AM - 6:00 PM EST',
                    sunday: 'Closed'
                }
            },
            social: {
                facebook: 'https://facebook.com/vimagine',
                twitter: 'https://twitter.com/vimagine',
                instagram: 'https://instagram.com/vimagine',
                linkedin: 'https://linkedin.com/company/vimagine'
            }
        };

        res.json({
            success: true,
            data: contactInfo
        });
    } catch (error) {
        console.error('Error fetching contact info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact information'
        });
    }
});

module.exports = router; 