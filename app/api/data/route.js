import { NextResponse } from 'next/server';

export async function GET(req) {
    const token = req.cookies.get('access_token');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // For this tasks, we just mock the data response.

    const data = {
        revenue: "$52,143.00",
        revenueTrend: "+25% from last month",
        subscriptions: "+2,400",
        subscriptionsTrend: "+185% from last month",
        sales: "+12,500",
        salesTrend: "+21% from last month",
        active: "+600",
        activeTrend: "+210 since last hour",
        activity: [
            { user: 'Alice', action: 'logged in successfully', time: 'Just now', status: 'success' },
            { user: 'Bob', action: 'updated profile', time: '5 min ago', status: 'success' },
            { user: 'System', action: 'backup completed', time: '1 hour ago', status: 'warning' },
        ]
    };

    return NextResponse.json(data);
}
