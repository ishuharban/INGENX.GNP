
async function populateForm() {
        try {
            const response = await fetch('/create-invoice');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);

            const companySelector = document.getElementById('companySelector');
            const companyNameInput = document.getElementById('companyName');
            const gstnNoInput = document.getElementById('gstnNo');
            const emailNoInput = document.getElementById('Email');
            const dealSelector = document.getElementById('dealSelector');
            const productNameInput = document.getElementById('productName');
            const invoiceNumberInput = document.getElementById('invoiceNumber');
            const invoiceDateInput = document.getElementById('invoiceDate');
            const invoiceAmountInput = document.getElementById('invoiceAmount');

         
            const uniqueInvoiceNumber = generateUniqueInvoiceNumber();
            invoiceNumberInput.value = uniqueInvoiceNumber;

         
            data.companyData.forEach(company => {
                const option = document.createElement('option');
                option.value = company._id; 
                option.textContent = company.companyname;
                companySelector.appendChild(option);
            });

         
            function updateFormFields(selectedCompanyId) {
                const selectedCompany = data.companyData.find(company => company._id === selectedCompanyId);
                if (selectedCompany) {
                    companyNameInput.value = selectedCompany.companyname;
                    gstnNoInput.value = selectedCompany.Gstnno;
                    emailNoInput.value=selectedCompany.businessemail;

                   
                    dealSelector.innerHTML = '';
                    const correspondingDeals = data.dealData.filter(deal => deal.user_id === selectedCompanyId);
                    if (correspondingDeals.length > 0) {
                        correspondingDeals.forEach(deal => {
                            const option = document.createElement('option');
                            option.value = deal._id;
                            option.textContent = deal.dealname;
                            dealSelector.appendChild(option);
                        });
                        dealSelector.selectedIndex = 0;
                        const selectedDeal = correspondingDeals[0]; 
                         productNameInput.value = selectedDeal.productname;
                    } else {
                        dealSelector.selectedIndex = -1;
                        productNameInput.value = '';
                    }
                } else {
                    companyNameInput.value = '';
                    gstnNoInput.value = '';
                    dealSelector.innerHTML = '';
                    productNameInput.value = ''; 
                }
            }

            dealSelector.addEventListener('change', () => {
            const selectedDealId = dealSelector.value;
            const selectedDeal = data.dealData.find(deal => deal._id === selectedDealId);
            if (selectedDeal) {
            productNameInput.value = selectedDeal.productname;
                } else {
                    productNameInput.value = '';
                }
            });

            companySelector.addEventListener('change', () => {
                const selectedCompanyId = companySelector.value;
                updateFormFields(selectedCompanyId);
                 });

            if (data.companyData.length > 0) {
                const firstCompany = data.companyData[0];
                companySelector.value = firstCompany._id;
                updateFormFields(firstCompany._id);

                if (data.dealData.length > 0) {
                const firstDeal = data.dealData.find(deal => deal.user_id === firstCompany._id);
                if (firstDeal) {
                    dealSelector.value = firstDeal._id;
                    productNameInput.value = firstDeal.productname;
                }
                } }
                } catch (error) {
                    console.error(error);
                }
                }


    function calculateTotalAmount() {
                const invoiceAmountInput = document.getElementById('invoiceAmount');
                const commissionAmountInput = document.getElementById('commissionAmount');
                const totalAmountSpan = document.getElementById('totalAmount');

                const invoiceAmount = parseFloat(invoiceAmountInput.value);
                const commissionAmount = parseFloat(commissionAmountInput.value);

                if (!isNaN(invoiceAmount )&& !isNaN(commissionAmount)) {
                    const gstAmount = (invoiceAmount * 18) / 100;
                    const totalAmount = invoiceAmount + gstAmount + commissionAmount;
                    totalAmountSpan.textContent = totalAmount.toFixed(2);
                } else {
                    totalAmountSpan.textContent = '0.00';
                }
                }
      document.getElementById('invoiceAmount').addEventListener('input', calculateTotalAmount);

    async function createPDF() {
            try {
                const response = await fetch('/create-invoice');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const pdfDoc = await PDFLib.PDFDocument.create();
                const page = pdfDoc.addPage([612, 792]); 
                const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

                page.setFont(helveticaFont);
                page.setFontSize(12);

                const invoiceAmount = parseFloat(document.getElementById('invoiceAmount').value);
                const gstAmount = (invoiceAmount * 18) / 100;
                const commissionAmount = parseFloat(document.getElementById('commissionAmount').value) || 0;
                const totalAmount = invoiceAmount + gstAmount +commissionAmount;
               
                const invoiceContent = [
                    `Invoice Number: ${document.getElementById('invoiceNumber').value}`,
                    `Invoice Date: ${document.getElementById('invoiceDate').value}`,
                    `Company Name: ${document.getElementById('companyName').value}`,
                    `GSTN Number: ${document.getElementById('gstnNo').value}`,
                    `Deal Name: ${document.getElementById('dealSelector').options[document.getElementById('dealSelector').selectedIndex].text}`,
                    `Product Name: ${document.getElementById('productName').value}`,
                    `Invoice Amount (Without GST): ${invoiceAmount.toFixed(2)} INR`,
                    `GST (18%): ${gstAmount.toFixed(2)} INR`,
                    `Commission: ${commissionAmount.toFixed(2)} INR`,
                    `Total Amount (Including GST): ${totalAmount.toFixed(2)} INR`,
                ];
                const contentY = 700; 
                const lineHeight = 14

                invoiceContent.forEach((line, index) => {
                    page.drawText(line, {
                        x: 50,
                        y: contentY - index * lineHeight,
                        size: 12,
                    });
                });

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'invoice.pdf';
                link.click();
                window.location.reload();
            } catch (error) {
                console.error(error);
            }}

    function generateUniqueInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0'); 
        const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
        return `INV-${year}${month}${day}-${randomDigits}`;
    }

    window.onload = populateForm;
    document.getElementById('commissionAmount').addEventListener('input', calculateTotalAmount);

    document.getElementById('invoiceForm').addEventListener('submit', function (e) {
            e.preventDefault();
            createPDF();
        });


       
    calculateTotalAmount();

