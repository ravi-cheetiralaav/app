import QRCode from 'qrcode';

export interface QRCodeData {
  orderId: string;
  userId: string;
  eventId: string;
}

export function parseQRCodeData(qrCodeString: string): QRCodeData | null {
  try {
    const parts = qrCodeString.split('_');
    if (parts.length >= 3) {
      return {
        orderId: parts[0],
        userId: parts[1],
        eventId: parts[2]
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    return null;
  }
}

export function generateQRCodeString(orderId: string, userId: string, eventId: string): string {
  return `${orderId}_${userId}_${eventId}`;
}

export async function generateQRCodeImage(qrCodeString: string): Promise<string> {
  try {
    return await QRCode.toDataURL(qrCodeString, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code image:', error);
    throw new Error('Failed to generate QR code');
  }
}