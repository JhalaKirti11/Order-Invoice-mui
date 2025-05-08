import logo from './logo.svg';
import './App.css';
import { Orders } from './Component/Orders';
import { OrdersComponent } from './Component/OrderComponent';

function App() {
  return (
    <div>
      {/* <Orders/> */}
      <OrdersComponent/>
    </div>
  );
}

export default App;
