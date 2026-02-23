// src/app/dashboard/account/page.tsx (server component)
import { getCurrentUser } from "~/lib/auth1";
import AccountPageClient from "./page.client";
import { getCompleteWalletInfo, getDashboardWalletWithAdmin } from "~/lib/queries/wallet";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Extract dash_id from user (assuming user has dash_id from your auth system)
  const dashId = user.dash_id || 1; // Fallback to 1 for testing

  // Fetch complete wallet information
  const walletInfo = await getCompleteWalletInfo(dashId);
  
  // Fetch all wallet data with admin details (for overview)
  const allWallets = await getDashboardWalletWithAdmin();

  // Format wallet data for the client
  const accountData = walletInfo ? {
    admin: {
      id: walletInfo.admin?.dadmin_id,
      name: walletInfo.admin?.fullname,
      email: walletInfo.admin?.admin_email,
      phone: walletInfo.admin?.admin_phone,
      role: walletInfo.admin?.role
    },
    wallet: walletInfo.wallet ? {
      id: walletInfo.wallet.wallet_id,
      accountNumber: walletInfo.wallet.account_number,
      bankCode: walletInfo.wallet.bank_code,
      accountName: walletInfo.wallet.account_name,
      customerId: walletInfo.wallet.customer_id,
      openedDate: walletInfo.wallet.created_at.toISOString().split('T')[0]
    } : null,
    balance: walletInfo.balance ? {
      ledgerBalance: walletInfo.balance.ledgerBalance,
      availableBalance: walletInfo.balance.availableBalance,
      netBalance: walletInfo.balance.netBalance,
      totalInflow: walletInfo.balance.totalInflowAmt,
      totalOutflow: walletInfo.balance.totalOutflowAmt,
      accountName: walletInfo.balance.accountName,
      currency: walletInfo.balance.currency
    } : null,
    transactions: walletInfo.transactions.map(t => ({
      id: t.transaction_id,
      reference: t.reference,
      amount: t.amount,
      description: t.description,
      status: t.status === 1 ? 'completed' : t.status === 0 ? 'pending' : 'failed',
      date: t.created_at.toISOString().split('T')[0],
      time: t.created_at.toTimeString().split(' ')[0].substring(0, 5),
      creditAccount: t.credit_account,
      debitAccount: t.debit_account
    }))
  } : null;

  // Calculate summary stats
  const summary = {
    totalWallets: allWallets?.length || 0,
    totalBalance: walletInfo?.balance?.ledgerBalance || 0,
    totalTransactions: walletInfo?.transactions.length || 0,
    pendingTransactions: walletInfo?.transactions.filter(t => t.status === 0).length || 0
  };

  console.log("Account data loaded:", {
    dashId,
    hasWallet: !!walletInfo?.wallet,
    hasBalance: !!walletInfo?.balance,
    transactionCount: walletInfo?.transactions.length
  });

  return (
    <AccountPageClient 
      user={user}
      accountData={accountData}
      summary={summary}
    />
  );
}