/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: API Health Check
 *     description: Returns the API homepage with available endpoints and documentation link
 *     responses:
 *       200:
 *         description: API homepage
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<!DOCTYPE html><html>...</html>"
 */

function getHomePage(req, res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ADN LAB API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .api-info { background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .endpoints { margin: 20px 0; }
            .endpoint { background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: white; }
            .get { background: #61affe; }
            .post { background: #49cc90; }
            a { color: #61affe; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧬 ADN LAB API</h1>
                <p>Payment System API for DNA Laboratory Services</p>
            </div>
            
            <div class="api-info">
                <h2>📚 API Documentation</h2>
                <p>Access the complete Swagger documentation here:</p>
                <p><strong><a href="/api-docs">👉 View API Documentation</a></strong></p>
            </div>
            
            <div class="endpoints">
                <h2>🚀 Available Endpoints</h2>
                
                <div class="endpoint">
                    <p><span class="method post">POST</span> <strong>/payments</strong></p>
                    <p>Create a new payment (MOMO, VNPAY, ZALOPAY)</p>
                </div>
                
                <div class="endpoint">
                    <p><span class="method get">GET</span> <strong>/payments</strong></p>
                    <p>Get all payments</p>
                </div>
                
                <div class="endpoint">
                    <p><span class="method get">GET</span> <strong>/payments/:entryId</strong></p>
                    <p>Get a specific payment by ID</p>
                </div>
                
                <div class="endpoint">
                    <p><span class="method post">POST</span> <strong>/refund/:entryId</strong></p>
                    <p>Process a payment refund</p>
                </div>
            </div>
            
            <div class="api-info">
                <h2>🔧 Development Info</h2>
                <p><strong>API Version:</strong> 1.0.0</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
        </div>
    </body>
    </html>
  `;
  res.send(html);
}

module.exports = {
  getHomePage
};
