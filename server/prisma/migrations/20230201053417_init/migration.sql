-- CreateTable
CREATE TABLE "Individual" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corporation" (
    "id" TEXT NOT NULL,
    "corp_id" TEXT NOT NULL,

    CONSTRAINT "Corporation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayeeAccount" (
    "id" TEXT NOT NULL,
    "holder_id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "loan_account_number" TEXT NOT NULL,

    CONSTRAINT "PayeeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayorAccount" (
    "id" TEXT NOT NULL,
    "holder_id" TEXT NOT NULL,
    "routing_number" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,

    CONSTRAINT "PayorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "plaid_id" TEXT NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "total_amount" INTEGER,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payor_id" TEXT NOT NULL,
    "payee_id" TEXT NOT NULL,
    "payout_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Individual_employee_id_key" ON "Individual"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Corporation_corp_id_key" ON "Corporation"("corp_id");

-- AddForeignKey
ALTER TABLE "PayeeAccount" ADD CONSTRAINT "PayeeAccount_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "Individual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayeeAccount" ADD CONSTRAINT "PayeeAccount_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayorAccount" ADD CONSTRAINT "PayorAccount_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "Corporation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payor_id_fkey" FOREIGN KEY ("payor_id") REFERENCES "PayorAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payee_id_fkey" FOREIGN KEY ("payee_id") REFERENCES "PayeeAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payout_id_fkey" FOREIGN KEY ("payout_id") REFERENCES "Payout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
