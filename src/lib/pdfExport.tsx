import { pdf } from '@react-pdf/renderer'
import PDFReportReact from '@/components/report/PDFReportReact'
import { Transaction } from '@/types/transaction'

interface PDFOptions {
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  balance: number
  period?: string
  filename?: string
}

export const generatePDFReport = async ({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  period,
  filename = 'laporan-keuangan.pdf',
}: PDFOptions) => {
  if (transactions.length === 0) {
    alert('📭 Tidak ada data untuk periode yang dipilih.')
    return
  }

  try {
    const blob = await pdf(
      <PDFReportReact
        transactions={transactions}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        period={period}
      />
    ).toBlob()

    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('❌ Gagal membuat PDF. Silakan coba lagi.')
  }
}