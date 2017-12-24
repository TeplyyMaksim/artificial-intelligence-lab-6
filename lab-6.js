const { transactions, minConfidence, minSupport } = require('./transactions'),
  calculateSupport = (occurs, total) => Math.ceil(occurs / total * 100),
  fetchInitialItems = (transactions) => {
    const items = [];

    transactions.forEach(transaction => transaction.items
      .forEach(item => !items.includes(item) ? items.push(item) : null)
    );

    return items.map(item => ({ items: [item] }));
  },
  generateSupports = items => items
    .map(element => {
      const occurs = transactions
        .filter(transaction => element.items
          .every(item => transaction.items
            .includes(item))).length,
        support = calculateSupport(occurs, transactions.length);
    
      return {
        occurs,
        support,
        items: element.items
      }
    })
    .filter(item => item.support >= minSupport),
  defragmentSupports = supports => {
    const nextRowItems = [];

    supports.forEach((firstEl, index) => {
        supports
          .forEach(secondEl => {
            const allItems = firstEl.items.concat(secondEl.items);
            
            if ((new Set(allItems)).size === allItems.length
              && nextRowItems
                .every(itemsSet => !(allItems
                  .every(item => itemsSet.items
                    .includes(item))))) {
              nextRowItems.push({ items: allItems })
            }
          });
    });

    return nextRowItems;
  },
  generateSets = ({ setsAccomulator, initialItems, items}) => {
    const newSets = generateSupports(items || initialItems);
      innerAccomulator = setsAccomulator.concat(newSets);

    if (newSets.length <= 1) {
      return innerAccomulator;
    }

    return generateSets({
      initialItems,
      setsAccomulator: innerAccomulator,
      items: defragmentSupports(newSets.concat(initialItems))
    })
  }

console.log(generateSets({
  setsAccomulator: [],
  initialItems: fetchInitialItems(transactions)
}));
