document.addEventListener("DOMContentLoaded", function () {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach(function (tile) {
        tile.addEventListener("click", function () {
            const tileId = this.id;
            handleTileClick(tileId);
        });
    });

    function handleTileClick(tileId) {
        // Perform actions based on tile clicked
        switch (tileId) {
            case "dashboard":
               

                break;
            case "settings":
                // Code for handling settings tile
                break;
            case "users":
                // Code for handling users tile
                break;
            case "bar":
                 // In your cPanel JavaScript code
                 document.addEventListener("DOMContentLoaded", function () {
                    const progressInput = document.getElementById("progress-input");
                    const updateProgressBtn = document.getElementById("update-progress-btn");

                    updateProgressBtn.addEventListener("click", function () {
                        const progress = progressInput.value;
                        sendProgressUpdate(progress);
                    });
                });
                break;
            // Add cases for more tiles as needed
        }
    }

    // Example of using a built-in function
    const currentDate = new Date();
    console.log("Current date:", currentDate);

    // Example of a custom function
    function calculateSquare(number) {
        return number * number;
    }

    const squareResult = calculateSquare(5);
    console.log("Square result:", squareResult);
});
