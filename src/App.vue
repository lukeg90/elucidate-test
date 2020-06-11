<template>
    <div id="app">
        <div class="filter">
            <h2>Filter by:</h2>
            <label class="b-contain">
                <span>Already Published</span>
                <input
                    id="published"
                    type="checkbox"
                    value="true"
                    v-model="publishedFilter"
                />
                <div class="b-input"></div>
            </label>
            <h3>Type:</h3>
            <label class="b-contain">
                <span>Extended</span>
                <input type="checkbox" value="extended" v-model="types" />
                <div class="b-input"></div>
            </label>
            <label class="b-contain">
                <span>Intermediate</span>
                <input type="checkbox" value="intermediate" v-model="types" />
                <div class="b-input"></div>
            </label>
            <label class="b-contain">
                <span>Primary</span>
                <input type="checkbox" value="primary" v-model="types" />
                <div class="b-input"></div>
            </label>
            <h3>Score:</h3>
            <label class="input-label" for="minScore">Minimum:</label>
            <input type="number" id="minScore" v-model="minScore" />
            <label for="maxScore">Maximum:</label>
            <input type="number" id="maxScore" v-model="maxScore" /><br />
            <h3>Bank Details:</h3>
            <label for="bank-name">Name:</label>
            <input type="text" id="bank-name" v-model="bankQuery" />
            <label for="bic">BIC:</label>
            <input type="text" id="bic" v-model="bicQuery" /><br />
            <button class="reset" @click="reset">Reset Filters</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Bank Name</th>
                    <th>BIC</th>
                    <th>Report Score</th>
                    <th>Type</th>
                    <th>Created</th>
                    <th>Published</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in displayedReports" :key="report.uuid">
                    <td>{{ report.body.bankName }}</td>
                    <td>{{ report.body.bankBIC[0] }}</td>
                    <td>{{ report.body.reportScore }}</td>
                    <td>{{ report.body.type }}</td>
                    <td>{{ formatDate(report.createdAt) }}</td>
                    <td class="published-at">
                        {{ formatDate(report.publishedAt) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <p>
                <span>Page {{ currentPage }} of {{ numPages }}</span
                ><br />
                <button v-if="currentPage > 1" @click="prevPage">
                    Previous
                </button>
                <button
                    v-if="filteredReports.length > pageLimit * currentPage"
                    @click="nextPage"
                >
                    Next
                </button>
            </p>
        </div>
    </div>
</template>

<script>
import reports from "../public/reports.json";

// todo
// 1. pagination
// 2. ability to apply multiple filters - DONE
// 3. add style to form - flexbox?

export default {
    name: "App",
    data: () => {
        return {
            reports: reports,
            minScore: null,
            maxScore: null,
            bankQuery: "",
            bicQuery: "",
            publishedFilter: false,
            types: [],
            pageLimit: 10,
            currentPage: 1
        };
    },
    computed: {
        filteredReports() {
            let reports = this.reports;
            if (this.publishedFilter) {
                reports = reports.filter(
                    report => Date.parse(report.publishedAt) < new Date()
                );
            }
            if (this.types.length !== 0) {
                reports = reports.filter(report =>
                    this.types.includes(report.body.type)
                );
            }
            if (this.minScore) {
                reports = reports.filter(
                    report => report.body.reportScore >= this.minScore
                );
            }
            if (this.maxScore) {
                reports = reports.filter(
                    report => report.body.reportScore <= this.maxScore
                );
            }
            if (this.bankQuery) {
                let regexString = this.bankQuery;
                let regex = new RegExp(regexString, "gi");
                reports = reports.filter(report =>
                    regex.test(report.body.bankName)
                );
            }
            if (this.bicQuery) {
                let regexString = this.bicQuery;
                let regex = new RegExp(regexString, "gi");
                reports = reports.filter(report =>
                    regex.test(report.body.bankBIC[0])
                );
            }
            return reports;
        },
        displayedReports() {
            return this.filteredReports.filter((report, index) => {
                let start = (this.currentPage - 1) * this.pageLimit;
                let end = this.currentPage * this.pageLimit;
                if (index >= start && index < end) return true;
            });
        },
        numPages() {
            return Math.ceil(this.filteredReports.length / this.pageLimit);
        }
    },
    watch: {
        filteredReports() {
            this.currentPage = 1;
        }
    },
    methods: {
        reset() {
            this.publishedFilter = false;
            this.minScore = null;
            this.maxScore = null;
            this.bankQuery = "";
            this.bicQuery = "";
            this.types = [];
            this.currentPage = 1;
        },
        nextPage() {
            this.currentPage++;
        },
        prevPage() {
            this.currentPage--;
        },
        formatDate(dateString) {
            const options = {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
                timeZoneName: "short"
            };
            return new Date(dateString).toLocaleString("en-GB", options);
        }
    }
};
</script>

<style>
* {
    box-sizing: border-box;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 20px;
    color: #2b2d42;
}

body {
    background: #99c1b9;
}

.filter {
    color: #2b2d42;
}

table {
    width: 100%;
    border-collapse: collapse;
    border: 3px solid #2b2d42;
}

tbody tr:nth-child(odd) {
    background: #d4afb9;
}

tbody tr:nth-child(even) {
    background: #bda0bc;
}

th {
    text-align: left;
    background: #2b2d42;
    color: #d4afb9;
    padding: 10px;
}

td {
    text-align: left;
    padding: 8px;
    /* border: 2px solid #2c3e50; */
    color: #2b2d42;
}

button {
    background: #2b2d42;
    color: #d4afb9;
    font-size: 17px;
    cursor: pointer;
    padding: 10px;
    font-weight: bolder;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 140px;
}

.pagination {
    text-align: center;
}

label {
    font-weight: bolder;
}

input[type="number"] {
    background: #2b2d42;
    color: #d4afb9;
    margin-left: 10px;
    margin-right: 10px;
    border: 0px;
    width: 50px;
    border-radius: 5px;
    font-weight: bolder;
    height: 20px;
}

input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type="text"] {
    background: #2b2d42;
    color: #d4afb9;
    margin-left: 10px;
    margin-right: 10px;
    border: 0px;
    width: 200px;
    height: 20px;
    font-weight: bolder;
    border-radius: 5px;
}

input:focus {
    box-shadow: 0 0 0 2px rgba(75, 198, 185, 0.5019607843137255);
}

.reset {
    margin-top: 20px;
    margin-bottom: 20px;
}

/* checkboxes */

.b-contain *,
.b-contain *::before,
.b-contain *::after {
    box-sizing: content-box !important;
}

.b-contain input {
    position: absolute;
    z-index: -1;
    opacity: 0;
}

.b-contain span {
    line-height: 1.54;
    font-size: 1rem;
    font-family: inherit;
    font-weight: bolder;
}

.b-contain {
    display: table;
    position: relative;
    padding-left: 1.8rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
}

.b-contain input[type="checkbox"] ~ .b-input {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.25rem;
    width: 1.25rem;
    background: rgba(241, 245, 248, 1);
    transition: background 250ms;
    border: 1px solid #2b2d42;
    border-radius: 0.125rem;
}

.b-contain input[type="checkbox"] ~ .b-input::after {
    content: "";
    position: absolute;
    display: none;
    left: 0.45rem;
    top: 0.18rem;
    width: 0.25rem;
    height: 0.6rem;
    border: solid rgba(212, 175, 185, 1);
    border-width: 0 2px 2px 0;
    transition: background 250ms;
    transform: rotate(45deg);
}

.b-contain input:checked ~ .b-input::after {
    display: block;
}

.b-contain:hover input ~ .b-input,
.b-contain input:focus ~ .b-input {
    background: rgb(231, 238, 243);
}

.b-contain input:focus ~ .b-input {
    box-shadow: 0 0 0 2px rgba(75, 198, 185, 0.5019607843137255);
}

.b-contain input:checked ~ .b-input {
    background: rgba(43, 45, 66, 1);
    border-color: rgba(43, 45, 66, 1);
}

.b-contain input[type="checkbox"]:disabled ~ .b-input {
    background: rgba(241, 245, 248, 1);
    border-color: rgba(184, 194, 204, 1);
    opacity: 0.6;
    cursor: not-allowed;
}

.b-contain input:checked:focus ~ .b-input,
.b-contain:hover input:not([disabled]):checked ~ .b-input {
    background: rgba(43, 45, 66, 1);
    border-color: rgba(43, 45, 66, 1);
}

.b-contain .b-input::before {
    content: "";
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 3rem;
    height: 3rem;
    margin-left: -0.85rem;
    margin-top: -0.85rem;
    background: rgba(0, 130, 243, 1);
    border-radius: 2rem;
    opacity: 0.6;
    z-index: 99999;
    transform: scale(0);
}

@keyframes b-ripple {
    0% {
        transform: scale(0);
    }

    20% {
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(1);
    }
}

@keyframes b-ripple-duplicate {
    0% {
        transform: scale(0);
    }

    30% {
        transform: scale(1);
    }

    60% {
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(1);
    }
}

.b-contain input + .b-input::before {
    animation: b-ripple 250ms ease-out;
}

.b-contain input:checked + .b-input::before {
    animation-name: b-ripple-duplicate;
}

.b-contain .b-input::before {
    visibility: hidden;
}

.b-contain input:focus + .b-input::before {
    visibility: visible;
}

.b-contain:first-child .b-input::before {
    visibility: hidden;
}
</style>
