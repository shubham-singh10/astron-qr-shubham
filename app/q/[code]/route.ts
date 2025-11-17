
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Link from '@/lib/models/Link';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    await connectDB();

    const link = await Link.findOne({ shortCode: code });
    if (!link) {
      // Return 404 page
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>QR Not Found</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .container {
                text-align: center;
                padding: 2rem;
              }
              h1 {
                font-size: 4rem;
                margin: 0;
              }
              p {
                font-size: 1.5rem;
                margin-top: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404</h1>
              <p>QR Code Not Found</p>
              <p style="font-size: 1rem; opacity: 0.8;">Code: ${code}</p>
            </div>
          </body>
        </html>`,
        {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Redirect to destination URL
    return NextResponse.redirect(link.destinationUrl, 307);
  } catch (error) {
    console.error('Redirect Error:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #1a1a1a;
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 {
              font-size: 3rem;
              margin: 0;
              color: #ef4444;
            }
            p {
              font-size: 1.2rem;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ Error</h1>
            <p>Something went wrong</p>
          </div>
        </body>
      </html>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}