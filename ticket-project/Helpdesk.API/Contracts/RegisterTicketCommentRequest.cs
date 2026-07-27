namespace Helpdesk.API.Contracts;

public sealed record RegisterTicketCommentRequest(
    string Content,
    string RowVersion);