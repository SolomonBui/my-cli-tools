---
inclusion: always
---

# Shortcut: userstory

Khi user dua Jira ticket key (VD: CRP-1234) hoac Confluence page ID va noi "user story" / "use case":

## Step 1: Doc thong tin

- Jira: Goi mcp_atlassian_mcp_server_getJiraIssue voi cloudId: fecredit.atlassian.net
- Confluence: Goi mcp_atlassian_mcp_server_getConfluencePage voi cloudId: fecredit.atlassian.net

Doc ca linked tickets, attachments description neu can.

## Step 2: Viet Use Case / User Story

Format output trong chat:

### User Story

**As a** [role/persona]
**I want to** [action/goal]
**So that** [benefit/value]

### Acceptance Criteria

1. GIVEN [context] WHEN [action] THEN [expected result]
2. ...

### Use Case

**Use Case Name:** [ten]
**Actor:** [ai thuc hien]
**Preconditions:** [dieu kien truoc]
**Main Flow:**
1. ...
2. ...
**Alternative Flow:**
- ...
**Postconditions:** [ket qua sau khi hoan thanh]

### Business Rules

- ...

### Notes

- Thong tin bo sung tu ticket/confluence

## Luu y

- Doc KY description, comments, linked issues de hieu FULL context
- Neu ticket co nhieu sub-tasks, liet ke tung user story cho moi sub-task
- Viet bang TIENG VIET neu ticket/description bang tieng Viet
- Viet bang TIENG ANH neu ticket bang tieng Anh
- KHONG tu y them acceptance criteria khong co trong ticket - chi dua tren thong tin thuc te

