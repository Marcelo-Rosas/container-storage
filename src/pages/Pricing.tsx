import { Calculator, ArrowRight } from 'lucide-react'

export function Pricing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pricing Calculator</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Calculate freight costs instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Calculator size={24} className="text-accent" />
            Calculate Your Freight
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Origin City
              </label>
              <input
                type="text"
                placeholder="Enter origin city"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination City
              </label>
              <input
                type="text"
                placeholder="Enter destination city"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="L"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 text-center"
                />
                <input
                  type="number"
                  placeholder="W"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 text-center"
                />
                <input
                  type="number"
                  placeholder="H"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 text-center"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cargo Type
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100">
                <option>General Cargo</option>
                <option>Fragile</option>
                <option>Refrigerated</option>
                <option>Hazardous</option>
              </select>
            </div>
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors">
            <span>Calculate Price</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Price Result */}
        <div className="bg-gradient-to-br from-accent to-purple-600 rounded-xl p-6 shadow-sm text-white">
          <h2 className="text-lg font-semibold mb-6 opacity-90">Estimated Price</h2>

          <div className="text-center py-8">
            <p className="text-5xl font-bold">R$ 0,00</p>
            <p className="text-sm opacity-75 mt-2">Fill in the form to get a quote</p>
          </div>

          <div className="space-y-3 mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between text-sm">
              <span className="opacity-75">Base Rate</span>
              <span>R$ 0,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-75">Weight Fee</span>
              <span>R$ 0,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-75">Insurance</span>
              <span>R$ 0,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-75">Taxes</span>
              <span>R$ 0,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
