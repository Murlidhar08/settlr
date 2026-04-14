// Lib
import { getUserConfig } from '@/lib/user-config';
import { PartyDetailsContent } from './components/party-details-content';

export default async function PartyDetailsPage({ params }: { params: Promise<{ partyId: string }> }) {
    const { partyId } = await params;
    const { currency } = await getUserConfig();

    return <PartyDetailsContent
        partyId={partyId}
        currency={currency}
    />;
}
