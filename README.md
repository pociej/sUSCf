# Stablewatch Holder Type Proportion Chart

## Overview

Create a simple pie chart showing the relative proportions of total balances for "eoa" holders and "sc" holders on the `holdersData` object from the most recent `data` entry, from the following endpoint:

**API Endpoint:**  
[https://stablewatch-yield-backend-dev-4d18.up.railway.app/api/testhourlypools/0xc8cf6d7991f15525488b2a83df53468d682ba4b0?api_key=wagmi-with-sw](https://stablewatch-yield-backend-dev-4d18.up.railway.app/api/testhourlypools/0xc8cf6d7991f15525488b2a83df53468d682ba4b0?api_key=wagmi-with-sw)

> The `holdersData.holders` field only contains data for the top 10 holders of each asset, but we will let these 10 data points be representative of all holders.

> You can assume that the response "data" entries are sorted by date, so that the first entry in the data array (data[0]) represents the most recent data point.

---

## Tools and Frameworks

You are free to use any tools (e.g., AI), frontend frameworks, and libraries you feel most comfortable with to complete this task.

## Basic Requirements

### 1. Data Fetching

- On component mount, fetch the data and store it in the component's state.

### 2. Chart Requirements

#### Timeseries Chart

**_No visual aspects of the chart will be evaluated, only the functionality of the code._**

- Display a Pie Chart showing the distribution of the asset balances held between different the 2 different holder types from the most recent `data` entry.
  - **Slices:**
    - Summed balances of all holders of type: `"eoa"` (Externally Owned Accounts)
    - Summed balances of all holders of type: `"sc"` (Smart Contracts)
  - **Also Label:**
    - Which timestamp the pie chart is for

---

### 3. State & Filtering

#### Small Balance Filter

- Add a toggle switch labeled **"Exclude small EOA balances"**.
- When enabled, any holder of type `"eoa"` with a balance less than `3x10^24` should be excluded from the chart's calculations.

#### Total Balance Display

- Show the **total balance** (not the proportions, the sum of all `"balance"` values) of all holders currently shown in the chart.
- Do **not** include any exponential notation, scientific notation, or any other kind of value formatting—just the raw total balance should be displayed.
- The total should account for the filter toggle state.

---

### 4. Data Quality Correction Task

- The `holdersData` in the API response is for the Ethereum token sUSDf (`0xc8CF6D7991f15525488b2A83Df53468D682Ba4B0`), but it is actually outdated and does not properly show the top 10 holders.
- **Question:** What is the Ethereum address of the holder with the largest balance of sUSDf that is missing from `holdersData`?

---

## Stretch Requirement

### 5. Gnosis Safe Entity Toggle

- Add a toggle to consider holders with type `"sc"` but with entity `"gnosisSafe"` as type `"eoa"` instead.
- The small balance filter and total balance display should react appropriately to this toggle.

---