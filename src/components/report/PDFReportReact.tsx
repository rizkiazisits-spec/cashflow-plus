import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Transaction } from '@/types/transaction'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#f8fafc',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 700,
    fontFamily: 'Helvetica-Bold',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: 'Helvetica',
    marginTop: 2,
  },
  headerDate: {
    color: 'white',
    fontSize: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: 20,
    fontFamily: 'Helvetica',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: '12px 14px',
    borderRadius: 8,
    flex: 1,
    border: '1px solid #e2e8f0',
  },
  cardLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
    fontFamily: 'Helvetica',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'Helvetica-Bold',
  },
  cardMessage: {
    fontSize: 9,
    color: '#1e3a8a',
    fontFamily: 'Helvetica',
    marginTop: 2,
  },
  chartSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #e2e8f0',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  barContainer: {
    marginBottom: 8,
  },
  barLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginBottom: 2,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  bar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  table: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2px solid #cbd5e1',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cellDate: {
    width: '20%',
    fontSize: 9,
    color: '#475569',
    fontFamily: 'Helvetica',
  },
  cellTitle: {
    width: '35%',
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
  },
  cellCategory: {
    width: '25%',
    fontSize: 9,
    color: '#475569',
    fontFamily: 'Helvetica',
  },
  cellAmount: {
    width: '20%',
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '2px dashed #cbd5e1',
    textAlign: 'center',
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'Helvetica',
  },
  badge: {
    backgroundColor: '#fbbf24',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    color: '#78350f',
    fontFamily: 'Helvetica-Bold',
  },
})

interface PDFReportReactProps {
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
  balance: number
  period?: string
}

const PDFReportReact = ({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  period,
}: PDFReportReactProps) => {
  const expenseData = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc: Record<string, number>, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      return acc
    }, {})

  const totalExpenseAmount = Object.values(expenseData).reduce((a, b) => a + b, 0)

  const chartData = Object.entries(expenseData).map(([name, value]) => ({
    name,
    value,
    percentage: totalExpenseAmount > 0 ? (value / totalExpenseAmount) * 100 : 0,
  }))

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const recentTransactions = transactions.slice(0, 10)

  const getBalanceMessage = () => {
    if (balance > 5000000) return 'Luar biasa!'
    if (balance > 1000000) return 'Tetap semangat!'
    if (balance > 0) return 'Ayo tingkatkan!'
    return 'Waktunya menabung!'
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e']

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>CashFlow+</Text>
            <Text style={styles.headerSub}>Laporan Keuangan • {period || 'Bulan Ini'}</Text>
          </View>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* 3 KARTU RINGKASAN */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Saldo</Text>
            <Text style={[styles.cardValue, { color: balance >= 0 ? '#065f46' : '#991b1b' }]}>
              {formatCurrency(balance)}
            </Text>
            <Text style={styles.cardMessage}>{getBalanceMessage()}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pemasukan</Text>
            <Text style={[styles.cardValue, { color: '#065f46' }]}>{formatCurrency(totalIncome)}</Text>
            <Text style={styles.cardMessage}>{transactions.filter(t => t.type === 'income').length} transaksi</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pengeluaran</Text>
            <Text style={[styles.cardValue, { color: '#991b1b' }]}>{formatCurrency(totalExpense)}</Text>
            <Text style={styles.cardMessage}>{transactions.filter(t => t.type === 'expense').length} transaksi</Text>
          </View>
        </View>

        {/* GRAFIK */}
        {chartData.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Pengeluaran per Kategori</Text>
            {chartData.map((item, index) => {
              const barWidth = Math.min((item.value / totalExpenseAmount) * 100, 100)
              const color = COLORS[index % COLORS.length]
              return (
                <View key={item.name} style={styles.barContainer}>
                  <View style={styles.barLabel}>
                    <Text>{item.name}</Text>
                    <Text>{formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)</Text>
                  </View>
                  <View style={styles.bar}>
                    <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: color }]} />
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* TABEL TRANSAKSI */}
        <View style={styles.table}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', fontFamily: 'Helvetica-Bold' }}>
              Transaksi Terbaru
            </Text>
            <Text style={styles.badge}>
              {transactions.length} transaksi
            </Text>
          </View>

          {recentTransactions.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.cellDate}>Tanggal</Text>
                <Text style={styles.cellTitle}>Judul</Text>
                <Text style={styles.cellCategory}>Kategori</Text>
                <Text style={[styles.cellAmount, { color: '#475569' }]}>Nominal</Text>
              </View>
              {recentTransactions.map((tx) => (
                <View key={tx.id} style={styles.tableRow}>
                  <Text style={styles.cellDate}>{formatDate(tx.date)}</Text>
                  <Text style={styles.cellTitle}>{tx.title}</Text>
                  <Text style={styles.cellCategory}>{tx.category}</Text>
                  <Text style={[styles.cellAmount, { color: tx.type === 'income' ? '#10b981' : '#f43f5e' }]}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={{ textAlign: 'center', color: '#94a3b8', padding: 20, fontFamily: 'Helvetica' }}>
              Belum ada transaksi
            </Text>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 2 }}>Laporan dibuat otomatis oleh CashFlow+</Text>
          <Text style={{ fontWeight: 700, fontFamily: 'Helvetica-Bold' }}>
            "Kelola uangmu, raih mimpimu!"
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default PDFReportReact