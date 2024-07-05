<template>
    <form>
        <div class="dropdown export-data">
            <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="add-item add-inline icon-config ml-1"></span>
                <span class="label">Exportar</span>
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="exportToExcel">Excel</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="exportToPDF">PDF</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="exportToCSV">CSV</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="exportToOFX">OFX</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="exportToCNAB240">CNAB 240</a></li>
            </ul>
        </div>
        <div class="table-data">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="col-val">
                            <p class="bold-600 mt-2 mb-2">Data</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600 mt-2 mb-2">Transação</p>
                        </th>
                        <th scope="col">
                            <p class="bold-600 mt-2 mb-2">Descrição</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600 mt-2 mb-2">Valor (R$)</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600 mt-2 mb-2">Saldo (R$)</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dataDetails.transactions" :key="index">
                        <td class="align-middle">
                            <span class="table-text">{{ item.date }}</span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">{{ item.id }}</span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">{{ item.description }}</span>
                        </td>
                        <td class="align-middle" :class="'transaction-' + item.type.toLowerCase()">
                            <span class="table-text">
                                R$ {{ item.type.toLowerCase() === 'debit' ? "-" : "+" }}
                                {{ Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                            </span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">
                                R$ {{ item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-summary">
                <tfoot>
                    <tr>
                        <td colspan="4" class="bold-600"><span class="title">Saldo final</span></td>
                        <td class="bold-600 col-val">R$ {{ dataDetails.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </form>
</template>

<script>
    import xlsx from 'xlsx/dist/xlsx.full.min';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
    import saveAs from 'file-saver';
    
    

    export default {
        name: "FormDetails",
        emits: ["closeModal", "saveModal"],
        data() {
            return {
                selectTab: "details"
            }
        },
        props: {
            dataDetails: Object
        },

        methods: {
            exportToExcel() {
                let jsonData = [];
                for (let transaction of this.dataDetails.transactions) {
                    jsonData.push({
                        "Data": transaction.date,
                        "Transação": transaction.id,
                        "Descrição": transaction.description,
                        "Valor (R$)": transaction.amount,
                        "Saldo (R$)": transaction.balance
                    });
                }
                const XLSX = xlsx;
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(jsonData);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
                XLSX.writeFile(workbook, "Transações.xlsx");
            },
            exportToPDF() {
                const doc = new jsPDF();
                const header = [["Data", "Transação", "Descrição", "Valor (R$)", "Saldo (R$)"]];
                const rows = this.dataDetails.transactions.map(transaction => [transaction.date, transaction.id, transaction.description, transaction.amount, transaction.balance]);
                doc.autoTable({
                    head: header,
                    body: rows
                });
                doc.save('Transações.pdf');
            },
            exportToCSV() {
                let jsonData = [];
                for (let transaction of this.dataDetails.transactions) {
                    jsonData.push({
                        "Data": transaction.date,
                        "Transação": transaction.id,
                        "Descrição": transaction.description,
                        "Valor (R$)": transaction.amount,
                        "Saldo (R$)": transaction.balance
                    });
                }
                const csvContent = '\uFEFF' + this.convertArrayOfObjectsToCSV(jsonData);
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                saveAs(blob, 'Transações.csv'); 
            },
            convertArrayOfObjectsToCSV(data) {
                const header = Object.keys(data[0]).join(';') + '\n';
                const csv = data.map(row => {
                    return Object.values(row).map(value => {
                    return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                    }).join(';');
                }).join('\n');
                return header + csv;
            },
            exportToOFX() {
                const transactions = this.dataDetails.transactions;
                const ofxContent = this.generateOFX(transactions);
                const blob = new Blob([ofxContent], { type: 'application/octet-stream' });
                saveAs(blob, 'transacoes.ofx'); 
            },
            generateOFX(transactions) {
                const header = `OFXHEADER:100\nDATA:OFXSGML\nVERSION:102\nSECURITY:NONE\nENCODING:USASCII\nCHARSET:1252\nCOMPRESSION:NONE\nOLDFILEUID:NONE\nNEWFILEUID:NONE\n\n`;
                const body = `
                    <OFX>
                    <SIGNONMSGSRSV1>
                        <SONRS>
                        <STATUS>
                            <CODE>0</CODE>
                            <SEVERITY>INFO</SEVERITY>
                        </STATUS>
                        <DTSERVER>${this.formatDate(new Date())}</DTSERVER>
                        </SONRS>
                    </SIGNONMSGSRSV1>
                    <BANKMSGSRSV1>
                        <STMTTRNRS>
                        <STMTRS>
                            <CURDEF>BRL</CURDEF>
                            <BANKACCTFROM>
                            <BANKID>123456</BANKID>
                            <ACCTID>7890</ACCTID>
                            <ACCTTYPE>CHECKING</ACCTTYPE>
                            </BANKACCTFROM>
                            <BANKTRANLIST>
                            ${transactions.map(transaction => `
                                <STMTTRN>
                                <TRNTYPE>${transaction.type.toUpperCase()}</TRNTYPE>
                                <DTPOSTED>${this.formatDate(transaction.date)}</DTPOSTED>
                                <TRNAMT>${transaction.amount}</TRNAMT>
                                <NAME>${transaction.description}</NAME>
                                </STMTTRN>
                            `).join('')}
                            </BANKTRANLIST>
                        </STMTRS>
                        </STMTTRNRS>
                    </BANKMSGSRSV1>
                    </OFX>
                `;
                return header + body;
            },
            formatDate(dateValue) {
                let date;
                if (typeof dateValue === "string") {
                    let partDate = dateValue.split('/');
                    date = new Date(partDate[2], partDate[1] -1, partDate[0]);
                } else {
                    date = dateValue;
                }
                const year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) month = `0${month}`;
                let day = date.getDate();
                if (day < 10) day = `0${day}`;
                return `${year}${month}${day}`;
            },
            exportToCNAB240() {
                let generatedCnabFile = new Blob([this.dataDetails.cnabData], { type: 'text/plain' });
                saveAs(generatedCnabFile, 'Transações.rem'); 
            },
        }
    };
</script>

<style lang="scss" scoped>
    .modal-container form {
        min-width: 950px !important;
    }

    .export-data {
        position: absolute;
        top: -57px;
        right: 0;
        button {
            border: 1px solid $gray-line;
            padding-left: 20px;
            padding-right: 20px;
            .label {
                margin-right: 20px;
            }
        }
    }

    .table {
        margin-bottom: 0;
        .col-val {
            width: 140px;
        }
        .transaction-credit {
            color: $blue-primary;
        }
        .transaction-debit {
            color: $red-primary;
        }
    }

    .table-summary {
        margin-top: 8px;
        tfoot {
            padding-top: 10px !important;
            td {
                background-color: $gray-bg !important;
                padding-top: 15px !important;
                padding-bottom: 15px !important;
                border: none !important;
            }
            .title {
                margin-left: 10px !important;
            }
        }
    }
</style>