import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import  Store from './Redux/store.js'


// رندر کردن اپلیکیشن به DOM
// انتخاب عنصر HTML با شناسه 'root' و رندر کردن در آن
ReactDOM.createRoot(document.getElementById('root')).render(
    // استفاده از Provider برای فراهم کردن دسترسی به Redux Store برای تمامی کامپوننت‌های داخل اپلیکیشن
    <Provider store={Store}>
        {/* رندر کردن کامپوننت اصلی اپلیکیشن */}
        <App />
    </Provider>,
    // کد بالا اپلیکیشن را به DOM وصل می‌کند و اطمینان می‌دهد که Store در دسترس تمامی کامپوننت‌ها قرار دارد
)
