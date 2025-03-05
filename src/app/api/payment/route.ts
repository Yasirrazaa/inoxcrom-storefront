import { NextRequest, NextResponse } from "next/server"
import { initiatePaymentSession } from "@lib/data/cart"

interface PaymentRequestBody {
  cart: {
    id: string
    total: number
    region: {
      currency_code: string
    }
  }
  paymentData: {
    provider_id: string
    data: Record<string, any>
  }
}

interface PaymentSession {
  id: string
  provider_id: string
  data: Record<string, any>
}

interface PaymentSessionResponse {
  payment_sessions: PaymentSession[]
}

const logPayment = (label: string, data: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PaymentAPI] ${label}:`, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    logPayment('Received request', { 
      method: req.method,
      url: req.url
    })
    
    const body = await req.json() as PaymentRequestBody
    logPayment('Request body', body)

    // Validate required fields
    if (!body.cart?.id) {
      logPayment('Validation failed', { error: 'Missing cart ID' })
      return NextResponse.json(
        { error: "Missing cart ID" },
        { status: 400 }
      )
    }

    if (!body.paymentData?.provider_id) {
      logPayment('Validation failed', { error: 'Missing payment provider' })
      return NextResponse.json(
        { error: "Missing payment provider" },
        { status: 400 }
      )
    }

    if (!body.cart.total) {
      logPayment('Validation failed', { error: 'Invalid cart total' })
      return NextResponse.json(
        { error: "Invalid cart total" },
        { status: 400 }
      )
    }

    logPayment('Initializing payment session', {
      cartId: body.cart.id,
      providerId: body.paymentData.provider_id,
      total: body.cart.total,
      currency: body.cart.region?.currency_code
    })

    const result = await initiatePaymentSession(body.cart, body.paymentData) as PaymentSessionResponse
    
    logPayment('Session initialized', {
      success: true,
      sessionCount: result.payment_sessions?.length,
      firstSessionId: result.payment_sessions?.[0]?.id
    })

    if (!result?.payment_sessions?.length) {
      logPayment('Session initialization failed', { error: 'No payment session created' })
      return NextResponse.json(
        { error: "Failed to create payment session" },
        { status: 500 }
      )
    }

    const session = result.payment_sessions.find(s => s.provider_id === body.paymentData.provider_id)

    if (!session) {
      logPayment('Session not found', { error: 'Payment session not found for provider' })
      return NextResponse.json(
        { error: "Payment session not found for provider" },
        { status: 500 }
      )
    }

    logPayment('Returning successful response', {
      sessionId: session.id,
      hasClientSecret: !!session.data?.client_secret
    })

    return NextResponse.json({
      success: true,
      session
    })

  } catch (error: any) {
    logPayment('Error', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        error: error.message || "Payment initialization failed",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}