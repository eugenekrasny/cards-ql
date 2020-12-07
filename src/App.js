import React, { Component } from 'react';
import './styles/app.css';
import OrderForm from './components/OrderForm';
import PackagesList from './components/PackagesList';
import { addPackageToCart, updateItemInCart, removePackageFromCart } from './utils/dataLoader';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: null,
      activeId: null,
      packages: [],
    };
    this.switchToPackageEdit = this.switchToPackageEdit.bind(this);
    this.cancelPackageEdit = this.cancelPackageEdit.bind(this);
    this.onPackageSubmit = this.onPackageSubmit.bind(this);
    this.onPackageRemove = this.onPackageRemove.bind(this);
    this.createCardsPackage = this.createCardsPackage.bind(this);
    this.updateCardsPackage = this.updateCardsPackage.bind(this);
  }

  onPackageSubmit(pack) {
    this.setState({ isLoading: true, errorMessage: null });
    const { activeId } = this.state;
    const quantity = parseInt(pack.quantity, 10);
    const price = parseInt(pack.price, 10);
    if (activeId) {
      this.updateCardsPackage(activeId, quantity, price);
    } else {
      this.createCardsPackage(quantity, price);
    }
  }

  async onPackageRemove() {
    this.setState({ isLoading: true, errorMessage: null });
    const { activeId } = this.state;
    try {
      await removePackageFromCart(activeId);
      this.cancelPackageEdit();
      this.setState((prevState) => ({
        packages: prevState.packages.filter((pack) => pack.id !== activeId),
      }));
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async createCardsPackage(quantity, price) {
    try {
      const packageId = await addPackageToCart(quantity, price);
      this.setState((prevState) => ({
        packages: [
          ...prevState.packages,
          {
            quantity,
            price,
            id: packageId,
          },
        ],
      }));
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async updateCardsPackage(id, quantity, price) {
    try {
      await updateItemInCart(id, quantity);
      this.cancelPackageEdit();
      this.setState((prevState) => ({
        packages: prevState.packages.map((cardsPackage) => {
          if (cardsPackage.id === id) {
            return {
              ...cardsPackage,
              quantity,
              price,
            };
          }
          return cardsPackage;
        }),
      }));
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  switchToPackageEdit(id) {
    this.setState({ activeId: id });
  }

  cancelPackageEdit() {
    this.setState({ activeId: null });
  }

  render() {
    const {
      packages,
      activeId,
      errorMessage,
      isLoading,
    } = this.state;
    const activePackage = packages.filter((pack) => pack.id === activeId)[0] || {};
    return (
      <div className="app">
        <p className="app__error">
          {errorMessage}
        </p>
        <PackagesList
          packages={packages}
          onModifyPackage={this.switchToPackageEdit}
          disabled={!!activeId || isLoading}
        />
        <OrderForm
          title={`Package ${(activeId ? packages.indexOf(activePackage) : packages.length) + 1}`}
          key={activeId || packages.length}
          onPackageSubmit={this.onPackageSubmit}
          onPackageRemove={this.onPackageRemove}
          onEditCancel={this.cancelPackageEdit}
          quantity={activePackage.quantity}
          price={activePackage.price}
          inEditMode={!!activeId}
          disabled={isLoading}
        />
      </div>
    );
  }
}

export default App;
