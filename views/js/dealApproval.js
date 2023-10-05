function logout() {
  window.location.href = "/login.html";
}


function fetchData() {
  fetch('/dealsDetails')
      .then(response => response.json())
      .then(data => {
          console.log(data)
          // const cardContainer = document.getElementById('card-container');
          const cardrow = document.getElementById('cardDetails');
                  data.forEach((item, i) => {
                      const card = document.createElement('div');
                      card.className = 'card col-md-3 hide ';
                      card.insertAdjacentHTML("afterbegin", `     
                             <div class="card-body m-2">
                              <h2 class="card-title text-center" style="text-transform: uppercase;">${item.dealname}</h2>
                              <hr/>
                              <div class="row ">                         
                                      <div class="col-6 mb-1">
                                          <h5>Status</h5>
                                          <p class="text-muted" id="status">${item.Status}</p>
                                      </div>
                                      <div class="col-6 mb-1">
                                          <h6>Customer Name </h6>
                                          <p class="text-muted">${item.customername}</p>
                                      </div>                                
                              </div>
                              <!-- Button trigger modal -->
                              <div class="container">
                                  <div class="row">
                                      <div class=" col-6 mb-3 py-2 float-left">
                                          <button type="button" class="card-text btn btn-primary"
                                              data-bs-toggle="modal" data-bs-target="#staticBackdrop${i}">
                                              Details
                                          </button>
                                      </div>    
                              <!-- Modal -->
                              <div class="modal fade" id="staticBackdrop${i}" data-bs-backdrop="static"
                                  data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
                                  aria-hidden="true">
                                  <div class="modal-dialog">
                                      <div class="modal-content">
                                          <div class="modal-header">
                                              <h5 class="modal-title" id="staticBackdropLabel">Deal Details</h5>
                                              <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                  aria-label="Close"></button>
                                          </div>
                                          <div class="modal-body">
                                              <div class="container">
                                                  <div class="row table-data" id="modal">
                                                      <div class="col-lg-12">
                                                          <div class="col-lg-12">
                                                              <table class="table table-hover">
                                                                  <thead>
                                                                      <tr>
                                                                          <th>Deal Details</th>
                                                                          <th>Value</th>
                                                                      </tr>
                                                                  </thead>
                                                                  <tbody>
                                                                      <tr>
                                                                          <td name="dealname">Deal Name</td>
                                                                          <td id="dealname">${item.dealname}</td>
                                                                      </tr>
                                                                      <td name="customername">Customer Name</td>
                                                                      <td id="customername">${item.customername}</td>
                                                                      </tr>
                                                                      <tr>
                                                                            <td name="toi">Type of Industry</td>
                                                                          <td id="gstnno">${item.toi}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td name="opptype">Opportunity Type</td>
                                                                          <td id="opptype">${item.opptype}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td name="productname">Product Name</td>
                                                                          <td id="productname">${item.productname}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td name="currenterp">Current ERP</td>
                                                                          <td id="email">${item.currenterp}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td name="nou">Number of User</td>
                                                                          <td id="nou">${item.nou}</td>
                                                                          </td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td name="status">Status</td>
                                                                          <td id="status">${item.Status}</td>
                                                                      </tr>
                                                                      ${item.Status === 'Rejected' ? `
                                                                      <tr>
                                                                          <td name="comments">Comments</td>
                                                                          <td id="comment">${item.comment || 'No comments available'}</td>
                                                                      </tr>
                                                                      ` : ''}                                                                      
                                                                  </tbody>
                                                              </table>
                                                          </div>
                                                          <hr />
                                                          <div class="row col-lg-12 md-2" id="status">
                                                              <!-- STATUS -->
                                                              <div class="col-lg-6">
                                                                  <a class="btn btn-primary p"href="./dlc.html"><b>DETAIL
                                                                          SUMMARY</b></a>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="modal-footer">
                                              <button type="button" class="btn btn-secondary"
                                                  data-bs-dismiss="modal">Close</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <hr />
                              <p class="card-text"><small class="text-muted">Last updated ${item.updatedAt}</small></p>
                          </div>
              `);
                      cardrow.appendChild(card);
                      const statusFilter = document.getElementById('statusFilter');
                      statusFilter.addEventListener('change', filterDealsByStatus);
                      filterDealsByStatus();
                      // const downloadPDFButton = document.getElementById('downloadPDFButton');
                      // downloadPDFButton.addEventListener('click', downloadPDF);
                  });      
      })
      .catch(error => {
          console.log('Error:', error);
      });
  function filterDealsByStatus() {
      const selectedStatus = document.getElementById('statusFilter').value;
     console.log(selectedStatus)
      const cards = document.querySelectorAll('.card');
      console.log(cards)
      cards.forEach((card, index) => {
          const statusElement = card.querySelector('#status');
          console.log(statusElement)
          console.log('Card ' + index + ' Status:', statusElement.textContent)
          if (selectedStatus === 'All' || statusElement.textContent === selectedStatus) {
              card.classList.remove('hide');
          } else {
              card.classList.add('hide');
          }
      });
  }
  function downloadPDF() {
   
      const doc = new jsPDF();
      
      const headers = [['Deal Name', 'Status']]; 
      const data = [];
     
      const cardElements = document.querySelectorAll('.card');
      console.log(cardElements)
      cardElements.forEach(card => {
          const cardTitle = card.querySelector('.card-title').textContent;
          const status = card.querySelector('.text-muted').textContent;
         
          data.push([cardTitle, status]); 
      });
   
      doc.autoTable({
          head: headers,
          body: data,
      });
     
      doc.save('deals.pdf');
  }
}

window.onload = fetchData();
