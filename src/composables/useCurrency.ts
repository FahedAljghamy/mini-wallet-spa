/**
 * Currency Composable
 *
 * Reusable logic for currency conversion and formatting
 *
 * @author Fahed
 */

import { ref, computed } from 'vue'
import { CURRENCIES, EXCHANGE_RATES, CURRENCY_CODES } from '@/constants'
import type { Currency, ExchangeRates } from '@/types'

export function useCurrency(initialCurrency: Currency = 'AED') {
  // State
  const currentCurrency = ref<Currency>(initialCurrency)

  // Computed
  const exchangeRates = computed<ExchangeRates>(() => EXCHANGE_RATES)

  const currencyCodes = computed(() => CURRENCY_CODES)

  const availableCurrencies = computed(() => CURRENCIES)

  // Methods
  const formatCurrency = (amount: number, convert: boolean = false): string => {
    // Handle invalid amounts
    const validAmount = isNaN(amount) ? 0 : amount

    // Only convert if explicitly requested (for amounts from other currencies)
    const displayAmount = convert
      ? validAmount * exchangeRates.value[currentCurrency.value]
      : validAmount

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCodes.value[currentCurrency.value],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(displayAmount)
  }

  const convertAmount = (
    amount: number,
    fromCurrency: Currency = 'AED',
    toCurrency?: Currency,
  ): number => {
    const targetCurrency = toCurrency || currentCurrency.value
    const validAmount = isNaN(amount) ? 0 : amount

    // Convert from source currency to AED first
    const amountInAED = validAmount / exchangeRates.value[fromCurrency]

    // Then convert to target currency
    return amountInAED * exchangeRates.value[targetCurrency]
  }

  const toggleCurrency = (): void => {
    const currentIndex = CURRENCIES.indexOf(currentCurrency.value)
    const nextIndex = (currentIndex + 1) % CURRENCIES.length
    currentCurrency.value = CURRENCIES[nextIndex]
  }

  const setCurrency = (currency: Currency): void => {
    if (CURRENCIES.includes(currency)) {
      currentCurrency.value = currency
    }
  }

  const getCurrencySymbol = (currency?: Currency): string => {
    const targetCurrency = currency || currentCurrency.value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCodes.value[targetCurrency],
    })
      .format(0)
      .replace(/[0-9.,\s]/g, '')
  }

  const formatAmount = (amount: number, currency?: Currency): string => {
    const targetCurrency = currency || currentCurrency.value
    const validAmount = isNaN(amount) ? 0 : amount
    const convertedAmount = validAmount * exchangeRates.value[targetCurrency]

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount)
  }

  return {
    // State
    currentCurrency,

    // Computed
    exchangeRates,
    currencyCodes,
    availableCurrencies,

    // Methods
    formatCurrency,
    convertAmount,
    toggleCurrency,
    setCurrency,
    getCurrencySymbol,
    formatAmount,
  }
}
