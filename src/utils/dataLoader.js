/* eslint-env browser */

const formatSkuSuffix = (value = 0) => {
  const skuSuffix = `${value}`;
  if (skuSuffix.length < 5) {
    return formatSkuSuffix(`0${skuSuffix}`);
  }
  return skuSuffix;
};

async function runQuery(query) {
  const response = await fetch(
    'https://staging.nxte.nl:5000/graphql',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-store': '7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    },
  );
  const json = await response.json();
  const errors = json.errors || [];
  if (errors.length > 0) {
    if (!errors[0]) {
      throw Error('There was an error with processing the request. Please try to update values and execute it again.');
    }
    const errorMessages = errors.map((error) => error.message);
    throw Error(errorMessages.join('<br />'));
  }
  return json.data;
}

export async function addPackageToCart(quantity, price) {
  const json = await runQuery(`mutation {
    addPackageToCart(sku: "LECA${formatSkuSuffix(quantity * price * 100)}", quantity: ${quantity}, personalMessage: false) {
      id,
      items {
        id
      }
    }
  }`);
  const { addPackageToCart: { items } } = json;
  return items[items.length - 1].id;
}

export async function updateItemInCart(id, quantity) {
  const json = await runQuery(`mutation {
    updateItemInCart(cartItemId: "${id}", quantity: ${quantity}) {
      items {
        id
      }
    }
  }`);
  const { addPackageToCart: { items } } = json;
  return items[items.length - 1].id;
}

export async function removePackageFromCart(id) {
  const json = await runQuery(`mutation {
    removeItemFromCart(cartItemId: "${id}") {
      id,
    }
  }`);
  return json.data;
}
