(function() {

  // TODO: setup filtering via each book category

  var allBooks = [],
      sortFilter = '';

  init = function() {
    getBooks();
    bindFilters();
  },

  getBooks = function() {
    fetch('../../data/data.json')
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function(books) {
        // Combine all book categories into one array and remove duplicates
        allBooks = books[0].products.concat(books[1].products)
        // TODO: Create more dynamic concating of `n` number of arrays

        function removeDuplicatesFromArray(arr, prop) {
          var obj = {},
              nonDuplicatedArr = [];

          for (var i = 0, len = arr.length; i < len; i++) {
            if (!obj[arr[i][prop]]) {
              obj[arr[i][prop]] = arr[i];
            }
          }
          for (var key in obj) {
            nonDuplicatedArr.push(obj[key]);
          }
          return nonDuplicatedArr;
        }

        allBooks = removeDuplicatesFromArray(allBooks, 'id');
        updateCatalogView();
      })
      .catch(function(error) {
        showErrorMessaging();
      });
  },

  bindFilters = function() {
    // Grab filter from DOM and apply correct sort option
    $('[data-filter]').on('click', function() {
      var currentFilter = $(this).data('filter');

      // Only update if filter is different from current view
      if  (sortFilter !== currentFilter) {
        sortFilter = currentFilter;

        allBooks.sort(function(a, b) {
          // Normalize name values for comparison
          var aBookName = a.name.toUpperCase(),
              bBookName = b.name.toUpperCase();

          switch (currentFilter) {
            case "alphebetical":
              if(aBookName < bBookName) return -1;
              if(aBookName > bBookName) return 1;
              return 0;
              break;
            case "lowest":
              return a.price - b.price;
              break;
            case "highest":
              return b.price - a.price;
          }
        });
        updateCatalogView();
      }
    });
  },

  showErrorMessaging = function() {
    $('article').html('<h2>An error occurred. Please try again later.</h2>');
  },

  updateCatalogView = function() {
    var html = '';

    $.each(allBooks, function(i, value) {
      // Set default image if one is not available
      var imageSrc = value.image !== '' ? value.image : 'product_default.png';
      // Create markup to append to DOM
      html += '<section data-product-id="' + value.id + '"><a>';
      html += '<figure class="flex"><img src="assets/images/products/' + imageSrc + '">';
      html += '<figcaption><p>' + value.name + '</p>';
      html += '<div class="flex"><p>price</p><p>$' + value.price.toFixed(2) + '</p></div>';
      html += '</figcaption></figure></a></section>';
    });
    $('article').html(html);
  };

  init();
})();
